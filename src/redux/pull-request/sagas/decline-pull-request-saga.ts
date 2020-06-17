import { call, put, take, select } from 'redux-saga/effects';
import { getCurrentPullRequestUrlPieces } from 'src/redux/pull-request/selectors';
import urls from 'src/redux/pull-request/urls';
import { pullRequest } from 'src/redux/pull-request/schemas';
import authRequest, { jsonHeaders } from 'src/utils/fetch';
import { DECLINE } from '../decline-reducer';

export default function*() {
  while (true) {
    const { payload: message } = yield take(DECLINE.REQUEST);
    const { owner, slug, id } = yield select(getCurrentPullRequestUrlPieces);

    const url = urls.api.v20.decline(owner, slug, id);
    const request = authRequest(url, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ message }),
    });

    try {
      const response = yield call(fetch, request);

      if (!response.ok) {
        const body = yield response.json();
        throw new Error(body.error.fields.newstatus[0]);
      }

      const updatedPullRequest = yield response.json();

      yield put({
        type: DECLINE.SUCCESS,
        payload: updatedPullRequest,
        meta: {
          schema: pullRequest,
        },
      });
    } catch (e) {
      yield put({
        type: DECLINE.ERROR,
        payload: e.message,
      });
    }
  }
}
