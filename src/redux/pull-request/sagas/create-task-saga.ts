import { call, put, select, take } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';
import authRequest, { jsonHeaders } from 'src/utils/fetch';
import { getCurrentPullRequestUrlPieces } from 'src/redux/pull-request/selectors';
import urls from 'src/redux/pull-request/urls';
import { TASK_CREATE } from '../actions';
import { getErrorMessage } from './utils/get-error-message';

export default function* createTaskSaga() {
  while (true) {
    const {
      payload: { task, commentId, isGlobal },
    } = yield take(TASK_CREATE.REQUEST);
    const { owner, slug, id } = yield select(getCurrentPullRequestUrlPieces);
    const url = urls.api.internal.tasks(owner, slug, id);

    const authWrapped = authRequest(url, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({
        content: {
          raw: task,
        },
        ...(commentId !== undefined && {
          comment: {
            id: commentId,
          },
        }),
      }),
    });

    try {
      const response = yield call(fetch, authWrapped);

      if (!response.ok) {
        const message = yield call(getErrorMessage, response.clone());
        throw new Error(message);
      }

      const newTask = yield response.json();
      yield put({
        type: TASK_CREATE.SUCCESS,
        payload: { commentId, newTask, isGlobal },
      });
    } catch (e) {
      Sentry.captureException(e);
      yield put({
        type: TASK_CREATE.ERROR,
        payload: { isGlobal, commentId, error: e.message },
      });
    }
  }
}
