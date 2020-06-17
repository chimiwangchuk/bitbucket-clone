import { get } from 'lodash-es';
import { select, call } from 'redux-saga/effects';
import { uncurlyUuid } from '@atlassian/bitkit-analytics';
import { PullRequestFact } from 'src/sections/repository/sections/pull-request/facts';
import { publishFact } from 'src/utils/analytics/publish';
import {
  getPullRequestDestinationRepo,
  getPullRequestSourceRepo,
  getCurrentPullRequestId,
  getPullRequestDiffFileCount,
  getPullRequestDiffLinesCount,
} from 'src/redux/pull-request/selectors';

type FactAction = {
  type: string;
  payload: {
    name: string;
    extraFactData?: object;
  };
};

function* getBasePullRequestFactData() {
  const pullRequestId = yield select(getCurrentPullRequestId);
  const sourceRepo = yield select(getPullRequestSourceRepo);
  const destRepo = yield select(getPullRequestDestinationRepo);

  // With a pull request, it's possible for source repos to have
  // been deleted, but not destination repos.
  if (!destRepo) {
    return null;
  }

  return {
    from_repository_uuid: uncurlyUuid(get(sourceRepo, 'uuid', '')),
    pull_request_id: pullRequestId,
    to_repository_uuid: uncurlyUuid(destRepo.uuid),
    to_repository_owner_uuid: uncurlyUuid(get(destRepo, 'owner.uuid', null)),
  };
}

function* makePullRequestBaseFact(action: FactAction) {
  if (!action || !action.payload) {
    return null;
  }

  const eventName = action.payload.name;
  if (!eventName) {
    return null;
  }

  const prFactData = yield getBasePullRequestFactData();
  if (!prFactData) {
    return null;
  }

  const factData = {
    ...prFactData,
    ...action.payload.extraFactData,
  };

  return new PullRequestFact(eventName, factData);
}

export function* publishBasePullRequestFactSaga(action: FactAction) {
  const fact = yield makePullRequestBaseFact(action);
  if (!fact) {
    return;
  }

  yield call(publishFact, fact);
}

export function* publishPullRequestDiffFactSaga(action: FactAction) {
  const fact = yield makePullRequestBaseFact(action);
  if (!fact) {
    return;
  }

  fact.data.number_of_diff_lines = yield select(getPullRequestDiffLinesCount);
  fact.data.number_of_files = yield select(getPullRequestDiffFileCount);

  yield call(publishFact, fact);
}
