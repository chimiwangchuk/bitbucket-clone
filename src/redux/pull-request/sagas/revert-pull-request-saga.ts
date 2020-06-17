import qs from 'qs';
import { call, select, put } from 'redux-saga/effects';
import { Action } from 'redux';
import authRequest from 'src/utils/fetch';
import { Branch } from 'src/components/types';
import repositoryUrls from 'src/sections/repository/urls';
import { showFlagComponent } from 'src/redux/flags';

import {
  getCurrentRepositoryOwnerName,
  getCurrentRepositorySlug,
} from 'src/selectors/repository-selectors';
import { getCurrentPullRequestId } from '../selectors';

import { REVERT_PULL_REQUEST, RevertPullRequestOptions } from '../actions';
import urls from '../urls';

type ErrorType = {
  type: 'error';
  error: { message: 'string' };
};

export function* revertPullRequestSaga({
  payload,
}: Action & {
  payload: RevertPullRequestOptions;
}) {
  const owner = yield select(getCurrentRepositoryOwnerName);
  const slug = yield select(getCurrentRepositorySlug);
  const id = yield select(getCurrentPullRequestId);

  try {
    const response = yield call(
      fetch,
      authRequest(urls.api.internal.revert(owner, slug, id), {
        method: 'POST',
        body: qs.stringify(
          {
            branch_name: payload.branchName,
            commit_message: payload.commitMessage
              ? payload.commitMessage
              : null,
          },
          { skipNulls: true }
        ),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      })
    );

    const data: Branch | ErrorType = yield call([response, 'json']);
    if (data.type === 'error') {
      throw new Error(data.error.message);
    }

    yield call(
      [location, 'replace'],
      repositoryUrls.ui.createPullRequest(owner, slug, data.name)
    );
  } catch (e) {
    yield put({
      type: REVERT_PULL_REQUEST.ERROR,
      payload: e.message,
    });
    yield put(showFlagComponent('revert-pull-request-error'));
  }
}
