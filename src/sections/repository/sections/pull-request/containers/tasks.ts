import { connect } from 'react-redux';
import { getCurrentPullRequestId } from 'src/redux/pull-request/selectors';
import {
  getCurrentRepositoryOwnerName,
  getCurrentRepositorySlug,
  getCurrentRepositoryUuid,
} from 'src/selectors/repository-selectors';
import {
  getTasks,
  getTasksSlice,
  getCanResolveTask,
  getModifiableTasks,
} from 'src/selectors/task-selectors';
import { BucketState, BucketDispatch } from 'src/types/state';
import {
  fetchTasks,
  taskStateChange,
  COLLAPSE_TASKS_CARD,
} from 'src/redux/pull-request/actions';
import { TaskStateChangeOptions } from 'src/redux/pull-request/types';
import { PullRequestFetchProps } from 'src/types/pull-request';
import { Task } from 'src/components/types';
import TaskList from '../components/tasks/tasks';

const mapStateToProps = (state: BucketState) => {
  const { isLoading, hasError, isCardCollapsed } = getTasksSlice(state);

  return {
    owner: getCurrentRepositoryOwnerName(state),
    repoSlug: getCurrentRepositorySlug(state),
    pullRequestId: getCurrentPullRequestId(state),
    isLoading,
    isCollapsed: isCardCollapsed,
    hasError,
    tasks: getTasks(state),
    canResolveTask: getCanResolveTask(state),
    modifiableTasks: getModifiableTasks(state),
    repositoryUUID: getCurrentRepositoryUuid(state),
  };
};

export const mapDispatchToProps = (dispatch: BucketDispatch) => ({
  onFetchTasks: (props: PullRequestFetchProps) => {
    dispatch(fetchTasks(props));
  },

  onTaskStateChange: (props: TaskStateChangeOptions) => {
    dispatch(taskStateChange(props));
  },

  // @ts-ignore TODO: fix noImplicitAny error here
  onExpandChange: ({ isCollapsed }) =>
    dispatch({ type: COLLAPSE_TASKS_CARD, payload: isCollapsed }),

  onCommentLinkClick: (task: Task) => {
    if (task.comment) {
      window.location.hash = `comment-${task.comment.id}`; // triggers onPermalinkHashChange
    }
  },
});

export const PullRequestTasks = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskList);
