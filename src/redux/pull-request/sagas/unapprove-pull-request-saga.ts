import { take, select, call, put, fork, cancel } from 'redux-saga/effects';

import authRequest from 'src/utils/fetch';
import { getCurrentPullRequestUrlPieces } from 'src/redux/pull-request/selectors';
import urls from 'src/redux/pull-request/urls';
import { UNAPPROVE } from 'src/redux/pull-request/actions';
import updateParticipantsSaga from './update-participants-saga';
import approvalLoadingSaga from './approval-loading-saga';

function* unapprovePullRequest() {
  while (true) {
    yield take(UNAPPROVE.REQUEST);
    const spinnerTask = yield fork(approvalLoadingSaga);

    const { owner, slug, id } = yield select(getCurrentPullRequestUrlPieces);

    const url = urls.api.v20.approval(owner, slug, id);
    const authUrl = authRequest(url);

    try {
      const response = yield call(fetch, authUrl, { method: 'DELETE' });

      if (!response.ok) {
        const json = yield response.json();
        throw Error(json.error.message);
      }

      yield call(updateParticipantsSaga);
      yield put({ type: UNAPPROVE.SUCCESS });
    } catch (e) {
      yield put({
        type: UNAPPROVE.ERROR,
        payload: e.message,
        error: true,
      });
    } finally {
      yield cancel(spinnerTask);
    }
  }
}

export default unapprovePullRequest;
