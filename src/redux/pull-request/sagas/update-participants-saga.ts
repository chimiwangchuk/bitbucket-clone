import { put, select, call } from 'redux-saga/effects';

import {
  getCurrentPullRequest,
  getCurrentPullRequestUrlPieces,
} from 'src/redux/pull-request/selectors';
import authRequest from 'src/utils/fetch';
import urls from 'src/redux/pull-request/urls';
import {
  updatePullRequest,
  UPDATE_PARTICIPANTS,
} from 'src/redux/pull-request/actions';

function* updateParticipantsSaga() {
  const { owner, slug, id } = yield select(getCurrentPullRequestUrlPieces);
  const url = urls.api.v20.participants(owner, slug, id);
  const authUrl = authRequest(url);

  try {
    const response = yield call(fetch, authUrl);
    const json = yield response.json();

    if (!response.ok) {
      throw Error(json.error.message);
    }

    const currentPullRequest = yield select(getCurrentPullRequest);
    const updatedPullRequest = {
      ...currentPullRequest,
      participants: json.participants,
    };

    yield put(
      updatePullRequest(UPDATE_PARTICIPANTS.SUCCESS, updatedPullRequest)
    );
  } catch (e) {
    yield put({
      type: UPDATE_PARTICIPANTS.ERROR,
      payload: e.message,
    });
  }
}

export default updateParticipantsSaga;
