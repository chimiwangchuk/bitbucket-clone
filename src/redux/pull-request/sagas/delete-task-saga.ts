import { call, put, select, takeEvery } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';
import authRequest from 'src/utils/fetch';
import { getCurrentPullRequestUrlPieces } from 'src/redux/pull-request/selectors';
import urls from 'src/redux/pull-request/urls';
import { taskKey } from 'src/sections/repository/sections/pull-request/components/tasks/utils';
import { TASK_DELETE } from '../actions';
import { getErrorMessage } from './utils/get-error-message';

// @ts-ignore TODO: fix noImplicitAny error here
export function* deleteTaskSaga(action) {
  const { payload: task } = action;
  const { owner, slug, id } = yield select(getCurrentPullRequestUrlPieces);
  const url = urls.api.internal.task(owner, slug, id, task.id);

  const authWrapped = authRequest(url, {
    method: 'DELETE',
  });

  try {
    const response = yield call(fetch, authWrapped);

    if (!response.ok) {
      const message = yield call(getErrorMessage, response.clone());
      throw new Error(message);
    }

    yield put({
      type: TASK_DELETE.SUCCESS,
      payload: task,
    });
  } catch (e) {
    Sentry.captureException(e);
    yield put({
      type: TASK_DELETE.ERROR,
      payload: {
        task,
        errors: { [taskKey(task)]: e.message },
      },
    });
  }
}

export default function* watchDeleteTask() {
  yield takeEvery(TASK_DELETE.REQUEST, deleteTaskSaga);
}
