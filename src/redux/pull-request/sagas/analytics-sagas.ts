import { call, select } from 'redux-saga/effects';
import { Action } from 'redux';
import { PullRequestEventAttributesType } from 'src/redux/pull-request/actions';
import {
  DiffViewMode,
  getGlobalDiffViewMode,
  getGlobalIsWordDiffEnabled,
  getGlobalShouldIgnoreWhitespace,
} from 'src/redux/pull-request-settings';
import {
  publishScreenEvent,
  publishUiEvent,
  publishTrackEvent,
} from 'src/utils/analytics/publish';
import { uncurlyUuid } from 'src/components/analytics';
import {
  getCurrentPullRequestId,
  getPullRequestSourceRepo,
  getPullRequestDestinationRepo,
} from '../selectors';

export const PULL_REQUEST_SCREEN_NAME = 'pullRequestScreen';

export function* publishScreenEventSaga() {
  const diffView = yield select(getGlobalDiffViewMode);
  const enableWordDiff = yield select(getGlobalIsWordDiffEnabled);
  const ignoreWhitespace = yield select(getGlobalShouldIgnoreWhitespace);

  yield call(publishScreenEvent, PULL_REQUEST_SCREEN_NAME, {
    diffView: diffView === DiffViewMode.SideBySide ? 'sideBySide' : 'unified',
    enableWordDiff,
    ignoreWhitespace,
  });
}

export function* publishTrackEventSaga(
  action: Action & {
    payload: PullRequestEventAttributesType;
  }
) {
  const pullRequestId = yield select(getCurrentPullRequestId);
  const pullRequestSourceRepo = yield select(getPullRequestSourceRepo);

  yield call(publishTrackEvent, {
    action: action.payload.action,
    actionSubject: action.payload.actionSubject,
    actionSubjectId: action.payload.actionSubjectId,
    source: PULL_REQUEST_SCREEN_NAME,
    objectType: 'pullRequest',
    objectId: `${uncurlyUuid(
      pullRequestSourceRepo?.uuid || ''
    )}/${pullRequestId}`,
    attributes: action.payload.attributes,
  });
}

export function* publishUiEventSaga(
  action: Action & {
    payload: PullRequestEventAttributesType;
  }
) {
  const pullRequestId = yield select(getCurrentPullRequestId);
  const pullRequestDestinationRepo = yield select(
    getPullRequestDestinationRepo
  );
  const pullRequestSourceRepo = yield select(getPullRequestSourceRepo);

  yield call(publishUiEvent, {
    action: action.payload.action,
    actionSubject: action.payload.actionSubject,
    actionSubjectId: action.payload.actionSubjectId,
    source: 'pullRequest',
    objectId: uncurlyUuid(pullRequestSourceRepo?.uuid),
    objectType: 'repository',
    containerId: uncurlyUuid(pullRequestSourceRepo?.workspace?.uuid),
    containerType: 'workspace',
    attributes: {
      pullRequestId,
      toRepositoryUuid: uncurlyUuid(pullRequestDestinationRepo?.uuid),
      toRepositoryOwnerUuid: uncurlyUuid(
        pullRequestDestinationRepo?.owner?.uuid
      ),
      ...action.payload.attributes,
    },
  });
}
