import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import {
  getPullRequestSlice,
  getCurrentPullRequestAuthor,
  PRSelector,
} from 'src/redux/pull-request/selectors';
import { BucketState } from 'src/types/state';
import { PullRequestTasksState } from 'src/redux/pull-request/tasks-reducer';
import { taskKey } from 'src/sections/repository/sections/pull-request/components/tasks/utils';
import {
  getRepositoryAccessLevel,
  getHasRepositoryDirectAccess,
  getHasRepositoryGroupAccess,
} from './repository-selectors';
import { getCurrentUser } from './user-selectors';

export const getTasksSlice: PRSelector<PullRequestTasksState> = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.tasks
);

export const getTasksLoadingState = createSelector(
  getTasksSlice,
  tasksSlice => tasksSlice.isLoading
);

export const getTasks = createSelector(getTasksSlice, ({ items }) => items);

export const getUniqueTasksErrorMessages = createSelector(
  getTasksSlice,
  ({ taskErrors }) => Array.from(new Set(Object.values(taskErrors || {})))
);

export const getCanCreateTask = createSelector(
  getRepositoryAccessLevel,
  getHasRepositoryDirectAccess,
  getHasRepositoryGroupAccess,
  (accessLevel, hasDirectAccess, hasGroupAccess) => {
    // A user can create a task if they're given explicit access to the PR's
    // "to repository."
    //
    // We can assume that if the user has write or admin privileges then they
    // were given them explicitly (the only privilege that can be implicit is
    // "read" access, which is the default for a user viewing a public repository)
    if (accessLevel === 'write' || accessLevel === 'admin') {
      return true;
    }
    return hasDirectAccess || hasGroupAccess;
  }
);

export const getCanResolveTask = createSelector(
  getCanCreateTask,
  canCreate => canCreate
);

export const getModifiableTasks = createSelector(
  getTasks,
  getCurrentUser,
  getCurrentPullRequestAuthor,
  getRepositoryAccessLevel,
  (tasks, currentUser, prAuthor, accessLevel) => {
    // Anonymous users cannot modify any tasks
    if (!currentUser) {
      return [];
    }

    // Admins and PR authors can edit all tasks
    if (
      accessLevel === 'admin' ||
      (prAuthor && prAuthor.uuid === currentUser.uuid)
    ) {
      return tasks.map(taskKey);
    }

    // Non-admins and non-pr-authors can modify tasks
    // that they create
    return tasks
      .filter(task => task.creator && task.creator.uuid === currentUser.uuid)
      .map(taskKey);
  }
);

export const getCanEditSomeTasks = createSelector(
  getTasks,
  getModifiableTasks,
  (tasks, modifiableTasks) => {
    return tasks.reduce((result, task) => {
      if (result) {
        return result;
      }

      const denyEdit =
        task.state === 'RESOLVED' || !modifiableTasks.includes(taskKey(task));

      return !denyEdit || result;
    }, false);
  }
);

export const getTasksForComment = createCachedSelector(
  getTasks,
  (_state: BucketState, commentId: string) => commentId,
  (tasks, commentId) => {
    if (!commentId || !tasks.length) {
      return [];
    }
    const id = parseInt(commentId, 10);
    return tasks.filter(task => task.comment && task.comment.id === id);
  }
)((_state, commentId) => commentId);

const getIsCreatingCommentTask = createSelector(
  getTasksSlice,
  ({ isCreatingCommentTaskByTaskKey }) => isCreatingCommentTaskByTaskKey
);

export const getInitialTaskText = createSelector(
  getTasksSlice,
  ({ initialTaskText }) => initialTaskText
);

export const isCreateTaskInputVisible = createCachedSelector(
  getIsCreatingCommentTask,
  (_state: BucketState, commentId: string) => commentId,
  (isCreating, commentId) => !!isCreating[commentId]
)((_state, commentId) => commentId);
