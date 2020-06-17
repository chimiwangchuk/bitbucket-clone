import createReducer from 'src/utils/create-reducer';
import { Task } from 'src/components/types';
import { taskKey } from 'src/sections/repository/sections/pull-request/components/tasks/utils';
import { CREATE_JIRA_ISSUE_FORM_VISIBILITY_CHANGE } from '../jira/actions';
import * as Actions from './actions';

export type TaskMap<T> = { [taskKey: string]: T }; // prettier-ignore
export type TasksErrorMap = TaskMap<string>;
export type DeleteTaskLoadingMap = TaskMap<boolean>;

// The submitting/error state for tasks is tracked for each comment ID separately (to avoid spinners
// showing up on every comment when creating a comment task). It is possible to create a task not
// linked to a comment, which is what this reserved key is used for.
export const TASK_LOCATION_GLOBAL = 'TASK_LOCATION_GLOBAL';

function mergeTasks(tasks: Task[], updatedTasks: Task[]): Task[] {
  return tasks.map(task => {
    return updatedTasks.find(t => t.id === task.id) || task;
  });
}

// @ts-ignore TODO: fix noImplicitAny error here
export const getTaskLocation = ({ isGlobal, commentId }) =>
  isGlobal ? TASK_LOCATION_GLOBAL : commentId;

export enum TASK_STATE {
  NOT_EDITING = 'notEditing',
  EDITING = 'editing',
  SUBMITTING = 'submitting',
  ERROR = 'error',
}

export type EditableTaskState =
  | { state: TASK_STATE.NOT_EDITING }
  | { state: TASK_STATE.EDITING }
  | { state: TASK_STATE.SUBMITTING }
  | { state: TASK_STATE.ERROR; error: string };

const addCommentEditingTaskState = (
  state: PullRequestTasksState,
  taskId: number,
  newTaskState: EditableTaskState
): { commentEditingTasks: TaskMap<EditableTaskState> } => ({
  commentEditingTasks: {
    ...state.commentEditingTasks,
    [taskId]: newTaskState,
  },
});

export type PullRequestTasksState = {
  items: Task[];
  isLoading: boolean;
  isCardCollapsed: boolean;
  hasError: boolean;
  isCreatingCommentTaskByTaskKey: TaskMap<boolean>;
  createTaskHasErrorByTaskKey: TaskMap<boolean>;
  createTaskErrorMessageByTaskKey: TaskMap<string>;
  isCreateTaskSubmittingByTaskKey: TaskMap<boolean>;
  editTasksHasErrors: boolean;
  commentEditingTasks: TaskMap<EditableTaskState>;
  taskErrors: TasksErrorMap;
  isEditTasksSubmitting: boolean;
  isDeleteTaskSubmitting: DeleteTaskLoadingMap;
  initialTaskText: string;
};

export const initialState: PullRequestTasksState = {
  items: [],
  // TODO refactor these various separate create/edit/delete states for
  // submitting/hasError/errorMessage into a single taskStates object,
  // which maps task.id to an object which always has a "state" key. This
  // will make things simpler and avoid bugs with "impossible" state combos.
  isLoading: false,
  isCardCollapsed: false,
  hasError: false,
  isCreatingCommentTaskByTaskKey: {},
  createTaskHasErrorByTaskKey: {},
  createTaskErrorMessageByTaskKey: {},
  isCreateTaskSubmittingByTaskKey: {},
  editTasksHasErrors: false,
  commentEditingTasks: {},
  taskErrors: {},
  isEditTasksSubmitting: false,
  isDeleteTaskSubmitting: {},
  initialTaskText: '',
};

export default createReducer(initialState, {
  [Actions.COLLAPSE_TASKS_CARD](state, action) {
    const { payload: isOpen } = action;
    return {
      ...state,
      isCardCollapsed: isOpen,
    };
  },
  [Actions.LOAD_PULL_REQUEST.REQUEST](state) {
    return {
      ...state,
      items: initialState.items,
    };
  },
  [Actions.UNLOAD_PULL_REQUEST](state) {
    return {
      ...state,
      items: initialState.items,
    };
  },
  [Actions.FETCH_TASKS.REQUEST](state) {
    return {
      ...state,
      items: initialState.items,
      hasError: false,
      isLoading: true,
    };
  },
  [Actions.FETCH_TASKS.SUCCESS](state, action) {
    return {
      ...state,
      items: action.payload.values,
      hasError: false,
      isLoading: false,
    };
  },
  [Actions.FETCH_TASKS.ERROR](state) {
    return {
      ...state,
      items: initialState.items,
      hasError: true,
      isLoading: false,
    };
  },
  [Actions.TASK_STATE_CHANGE.SUCCESS](state, action) {
    return {
      ...state,
      items: action.payload.nextTasks,
    };
  },
  [Actions.TASK_STATE_CHANGE.ERROR](state, action) {
    return {
      ...state,
      items: action.payload,
    };
  },
  [Actions.TASK_CREATE.REQUEST](state, action) {
    const taskLocation = getTaskLocation(action.payload);
    return {
      ...state,
      createTaskHasErrorByTaskKey: {
        ...state.createTaskHasErrorByTaskKey,
        [taskLocation]: false,
      },
      createTaskErrorMessageByTaskKey: {
        ...state.createTaskErrorMessageByTaskKey,
        [taskLocation]: '',
      },
      isCreateTaskSubmittingByTaskKey: {
        ...state.isCreateTaskSubmittingByTaskKey,
        [taskLocation]: true,
      },
    };
  },
  [Actions.TASK_CREATE.SUCCESS](state, action) {
    const { newTask } = action.payload;
    const taskLocation = getTaskLocation(action.payload);
    return {
      ...state,
      items: [...state.items, newTask],
      createTaskHasErrorByTaskKey: {
        ...state.createTaskHasErrorByTaskKey,
        [taskLocation]: false,
      },
      createTaskErrorMessageByTaskKey: {
        ...state.createTaskErrorMessageByTaskKey,
        [taskLocation]: '',
      },
      isCreateTaskSubmittingByTaskKey: {
        ...state.isCreateTaskSubmittingByTaskKey,
        [taskLocation]: false,
      },
      isCreatingCommentTaskByTaskKey: {
        ...state.isCreatingCommentTaskByTaskKey,
        [taskLocation]: false,
      },
    };
  },
  [Actions.TASK_CREATE.ERROR](state, action) {
    const { error } = action.payload;
    const taskLocation = getTaskLocation(action.payload);
    return {
      ...state,
      createTaskHasErrorByTaskKey: {
        ...state.createTaskHasErrorByTaskKey,
        [taskLocation]: true,
      },
      createTaskErrorMessageByTaskKey: {
        ...state.createTaskErrorMessageByTaskKey,
        [taskLocation]: error,
      },
      isCreateTaskSubmittingByTaskKey: {
        ...state.isCreateTaskSubmittingByTaskKey,
        [taskLocation]: false,
      },
      isCreatingCommentTaskByTaskKey: {
        ...state.isCreatingCommentTaskByTaskKey,
        [taskLocation]: true,
      },
    };
  },
  [Actions.TASKS_EDIT.REQUEST](state) {
    return {
      ...state,
      editTasksHasErrors: false,
      taskErrors: {},
      isEditTasksSubmitting: true,
    };
  },
  [Actions.TASKS_EDIT.SUCCESS](state, action) {
    return {
      ...state,
      items: mergeTasks(state.items, action.payload),
      editTasksHasErrors: false,
      isEditTasksSubmitting: false,
    };
  },
  [Actions.TASKS_EDIT.ERROR](state, action) {
    return {
      ...state,
      editTasksHasErrors: true,
      taskErrors: action.payload,
      isEditTasksSubmitting: false,
    };
  },
  [Actions.TASKS_EDIT.PARTIAL_SUCCESS](state, action) {
    return {
      ...state,
      editTasksHasErrors: true,
      isEditTasksSubmitting: false,
      items: mergeTasks(state.items, action.payload.updatedTasks),
      taskErrors: action.payload.errors,
    };
  },
  [Actions.TASKS_CLEAR_ERRORS](state) {
    return {
      ...state,
      createTaskHasError: false,
      createTaskErrorMessage: false,
      editTasksHasErrors: false,
      taskErrors: {},
    };
  },
  [Actions.TASK_DELETE.REQUEST](state, action) {
    return {
      ...state,
      taskErrors: {},
      editTasksHasErrors: false,
      isDeleteTaskSubmitting: {
        ...state.isDeleteTaskSubmitting,
        [taskKey(action.payload)]: true,
      },
    };
  },
  [Actions.TASK_DELETE.SUCCESS](state, action) {
    return {
      ...state,
      isDeleteTaskSubmitting: {
        ...state.isDeleteTaskSubmitting,
        [taskKey(action.payload as Task)]: false,
      },
      items: state.items.filter(task => task.id !== action.payload.id),
    };
  },
  [Actions.TASK_DELETE.ERROR](state, action) {
    return {
      ...state,
      editTasksHasErrors: false,
      taskErrors: action.payload.errors,
      isDeleteTaskSubmitting: {
        ...state.isDeleteTaskSubmitting,
        [taskKey(action.payload.task)]: false,
      },
    };
  },
  [Actions.TOGGLE_CREATE_COMMENT_TASK_INPUT](state, action) {
    const { commentId, isCreating, selectedCommentText } = action.payload;
    return {
      ...state,
      initialTaskText: selectedCommentText || '',
      isCreatingCommentTaskByTaskKey: {
        ...state.isCreatingCommentTaskByTaskKey,
        [commentId]: isCreating,
      },
    };
  },
  [CREATE_JIRA_ISSUE_FORM_VISIBILITY_CHANGE](state, { payload }) {
    // Hides the create task input if the create Jira issue input becomes visible
    const { commentId, isVisible: isJiraVisible } = payload;
    if (!isJiraVisible) return state;
    return {
      ...state,
      isCreatingCommentTaskByTaskKey: {
        ...state.isCreatingCommentTaskByTaskKey,
        [commentId]: false,
      },
    };
  },
  // Action reducers for editing of individual comment tasks (i.e. not sidebar bulk task edit)
  [Actions.TOGGLE_EDIT_COMMENT_TASK_INPUT](state, action) {
    const { taskId, isEditing } = action.payload;
    return {
      ...state,
      ...addCommentEditingTaskState(state, taskId, {
        state: isEditing ? TASK_STATE.EDITING : TASK_STATE.NOT_EDITING,
      }),
    };
  },
  [Actions.TASK_EDIT.REQUEST](state, action) {
    const { taskId } = action.payload;
    return {
      ...state,
      ...addCommentEditingTaskState(state, taskId, {
        state: TASK_STATE.SUBMITTING,
      }),
    };
  },
  [Actions.TASK_EDIT.SUCCESS](state, action) {
    const { taskId, newTask } = action.payload;
    return {
      ...state,
      items: mergeTasks(state.items, [newTask]),
      ...addCommentEditingTaskState(state, taskId, {
        state: TASK_STATE.NOT_EDITING,
      }),
    };
  },
  [Actions.TASK_EDIT.ERROR](state, action) {
    const { taskId, error } = action.payload;
    return {
      ...state,
      ...addCommentEditingTaskState(state, taskId, {
        state: TASK_STATE.ERROR,
        error,
      }),
    };
  },
});
