import { call, put, select, takeEvery } from 'redux-saga/effects';
import { getTasks } from 'src/selectors/task-selectors';
import { Task } from 'src/components/types';
import authRequest, { jsonHeaders } from 'src/utils/fetch';
import { getCurrentUser } from 'src/selectors/user-selectors';
import { TASK_STATE_CHANGE } from '../actions';

// @ts-ignore TODO: fix noImplicitAny error here
export function* taskStateChangeSaga(action) {
  const {
    payload: { url, task: selectedTask, nextTaskState },
  } = action;

  const user = yield select(getCurrentUser);

  const tasks: Task[] = yield select(getTasks);

  const nextTask = { ...selectedTask, state: nextTaskState };
  const nextTasks: Task[] = tasks.map(task =>
    task.id === selectedTask.id ? nextTask : task
  );

  yield put({
    type: TASK_STATE_CHANGE.SUCCESS,
    payload: {
      user,
      task: nextTask,
      nextTasks,
    },
  });

  const authWrapped = authRequest(url, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify({ state: nextTaskState }),
  });

  const response = yield call(fetch, authWrapped);

  if (!response.ok) {
    yield put({
      type: TASK_STATE_CHANGE.ERROR,
      payload: [...tasks],
    });
  }
}

export default function* handleTaskStateChangeSaga() {
  yield takeEvery(TASK_STATE_CHANGE.REQUEST, taskStateChangeSaga);
}
