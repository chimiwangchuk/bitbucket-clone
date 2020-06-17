import { Action } from 'src/types/state';
import {
  ActivityApiResponse,
  isTaskActivity,
} from 'src/components/activity/types';
import { createAsyncAction } from 'src/redux/actions';
import { Task } from 'src/components/types/src/task';
import { User } from 'src/components/types';
import {
  prefixed,
  EXITED_CODE_REVIEW,
  TASK_CREATE,
  TASK_STATE_CHANGE,
} from './actions';

export type ActivityState = {
  activityEvents: ActivityApiResponse[];
  isActivityLoading: boolean;
  nextUrl: string | null;
  hasError: boolean;
};

export const FETCH_ACTIVITY = createAsyncAction(prefixed('FETCH_ACTIVITY'));

export const activityInitialState: ActivityState = {
  activityEvents: [],
  nextUrl: null,
  isActivityLoading: false,
  hasError: false,
};

const transformToTaskEvent = (
  newTask: Task,
  currentUser: User | undefined = undefined
) => {
  // Transforms a BBTask into an object minimally similiar to the task
  // activity events we get from the activity/ API (ActivityApi['TaskActivity'])
  const { id, creator, created_on: createdOn, state: taskState } = newTask;
  return {
    task: {
      id,
      actor: currentUser || creator,
      action: taskState === 'UNRESOLVED' ? 'CREATED' : 'RESOLVED',
      action_on: taskState === 'UNRESOLVED' ? createdOn : new Date(),
      updated_on: taskState === 'UNRESOLVED' ? createdOn : new Date(),
      task: newTask,
    },
  };
};

export default (
  state: ActivityState = activityInitialState,
  action: Action
) => {
  switch (action.type) {
    case FETCH_ACTIVITY.REQUEST:
      return {
        ...state,
        activityEvents: [],
        isActivityLoading: true,
        hasError: false,
      };
    case FETCH_ACTIVITY.SUCCESS: {
      const { nextUrl } = action.payload;
      return {
        ...state,
        activityEvents: [
          ...state.activityEvents,
          ...action.payload.activityEvents,
        ],
        isActivityLoading: false,
        hasError: false,
        nextUrl,
      };
    }
    case FETCH_ACTIVITY.ERROR:
      return {
        ...state,
        isActivityLoading: false,
        hasError: true,
      };
    case TASK_CREATE.SUCCESS: {
      const { newTask } = action.payload;
      return {
        ...state,
        activityEvents: [
          transformToTaskEvent(newTask),
          ...state.activityEvents,
        ],
      };
    }
    case TASK_STATE_CHANGE.SUCCESS: {
      const { task, user } = action.payload;
      if (task.state === 'RESOLVED') {
        return {
          ...state,
          activityEvents: [
            transformToTaskEvent(task, user),
            ...state.activityEvents,
          ],
        };
      } else {
        return {
          ...state,
          activityEvents: state.activityEvents.filter(event => {
            return !(
              isTaskActivity(event) &&
              event.task.task.id === task.id &&
              event.task.action === 'RESOLVED'
            );
          }),
        };
      }
    }
    case EXITED_CODE_REVIEW:
      return { ...activityInitialState };
    default:
      return state;
  }
};
