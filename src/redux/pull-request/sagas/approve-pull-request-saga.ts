import { take, select, call, put, fork, cancel } from 'redux-saga/effects';
import authRequest from 'src/utils/fetch';
import urls from 'src/redux/pull-request/urls';
import { APPROVE } from 'src/redux/pull-request/actions';
import { getCurrentPullRequestUrlPieces } from '../selectors';
import updateParticipantsSaga from './update-participants-saga';
import approvalLoadingSaga from './approval-loading-saga';
import { getErrorMessage } from './utils/get-error-message';

function* approvePullRequest() {
  while (true) {
    yield take(APPROVE.REQUEST);
    const spinnerTask = yield fork(approvalLoadingSaga);

    const { owner, slug, id } = yield select(getCurrentPullRequestUrlPieces);
    const url = urls.api.v20.approval(owner, slug, id);
    const authUrl = authRequest(url);

    try {
      const response = yield call(fetch, authUrl, { method: 'POST' });

      if (!response.ok) {
        const message = yield call(getErrorMessage, response);
        throw Error(message);
      }

      yield call(updateParticipantsSaga);
      yield put({ type: APPROVE.SUCCESS });
    } catch (e) {
      yield put({
        type: APPROVE.ERROR,
        payload: e.message,
        error: true,
      });
    } finally {
      yield cancel(spinnerTask);
    }
  }
}

export default approvePullRequest;
