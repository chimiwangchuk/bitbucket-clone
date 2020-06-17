import { call, put, select, take, all } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';
import authRequest, { jsonHeaders } from 'src/utils/fetch';
import { getCurrentPullRequestUrlPieces } from 'src/redux/pull-request/selectors';
import urls from 'src/redux/pull-request/urls';
import { getTasks } from 'src/selectors/task-selectors';
import { Task } from 'src/components/types';
import { taskKey } from 'src/sections/repository/sections/pull-request/components/tasks/utils';
import { Action } from 'src/types/state';
import { TASKS_EDIT, TASK_EDIT } from '../actions';
import { getErrorMessage } from './utils/get-error-message';

type SaveTaskResult = {
  task: Task;
  isError: boolean;
  errorMessage?: string;
};

function* saveTaskSaga(task: Task, nextRawContent: string) {
  const { owner, slug, id: pullRequestId } = yield select(
    getCurrentPullRequestUrlPieces
  );
  const url = urls.api.internal.task(owner, slug, pullRequestId, task.id);

  const authWrapped = authRequest(url, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify({
      content: {
        raw: nextRawContent,
      },
    }),
  });

  try {
    const response = yield call(fetch, authWrapped);
    if (response.ok) {
      const newTask = yield response.json();
      return {
        task: newTask,
        isError: false,
      } as SaveTaskResult;
    } else {
      const message = yield call(getErrorMessage, response.clone());
      throw new Error(message);
    }
  } catch (e) {
    Sentry.captureException(e);
    return {
      task,
      isError: true,
      errorMessage: e.message,
    } as SaveTaskResult;
  }
}

export function* editTaskSaga(action: Action) {
  const {
    payload: { taskId, newValue },
  } = action;
  const tasks = yield select(getTasks);
  const saveTask: Task = tasks.find((task: Task) => task.id === taskId);
  const result: SaveTaskResult = yield call(saveTaskSaga, saveTask, newValue);

  if (!result.isError) {
    yield put({
      type: TASK_EDIT.SUCCESS,
      payload: { taskId, newTask: result.task },
    });
  } else {
    yield put({
      type: TASK_EDIT.ERROR,
      payload: { taskId, error: result.errorMessage },
    });
  }
}

export function* editTasksSaga() {
  while (true) {
    const { payload: editTasksFormData } = yield take(TASKS_EDIT.REQUEST);
    const tasks = yield select(getTasks);
    const saveParams: { task: Task; nextRawContent: string }[] = tasks
      .filter(
        (task: Task) =>
          editTasksFormData[taskKey(task)].trim() !== task.content.raw.trim()
      )
      .map((task: Task) => ({
        task,
        nextRawContent: editTasksFormData[taskKey(task)],
      }));

    const saveTaskResults: SaveTaskResult[] = yield all(
      saveParams.map(({ task, nextRawContent }) =>
        saveTaskSaga(task, nextRawContent)
      )
    );

    const successfulResults = saveTaskResults.filter(result => !result.isError);
    const failedResults = saveTaskResults.filter(result => result.isError);

    const successPayload = successfulResults.map(({ task }) => task);
    const errorPayload = {};
    saveTaskResults.forEach(({ task, isError, errorMessage }) => {
      if (isError) {
        // @ts-ignore TODO: fix noImplicitAny error here
        errorPayload[taskKey(task)] = errorMessage;
      }
    });

    if (successPayload.length && failedResults.length) {
      // We're making N requests for N edited tasks,
      // and there's no guarantee that requests
      // will either all fail or all succeed.
      yield put({
        type: TASKS_EDIT.PARTIAL_SUCCESS,
        payload: {
          updatedTasks: successPayload,
          errors: errorPayload,
        },
      });
    } else if (successfulResults.length) {
      yield put({
        type: TASKS_EDIT.SUCCESS,
        payload: successPayload,
      });
    } else if (failedResults.length) {
      yield put({
        type: TASKS_EDIT.ERROR,
        payload: errorPayload,
      });
    } else {
      // This shouldn't happen because the "save tasks" button is
      // disabled until an edit is made
      Sentry.captureMessage(
        `Tried to save tasks without making changes`,
        Sentry.Severity.Info
      );

      // Fire a dummy success action to clear loading state
      yield put({
        type: TASKS_EDIT.SUCCESS,
        payload: [],
      });
    }
  }
}
