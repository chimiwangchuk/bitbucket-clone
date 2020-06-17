import { Schema } from 'normalizr';
import { TaskStateChangeOptions } from '../types';

import { TASK_STATE_CHANGE } from './constants';

export type TaskStateChangeAction = {
  type: string;
  payload: TaskStateChangeOptions;
  meta: {
    schema: Schema;
  };
};

export default ({ url, task, nextTaskState }: TaskStateChangeOptions) => ({
  type: TASK_STATE_CHANGE.REQUEST,
  payload: { url, task, nextTaskState },
});
