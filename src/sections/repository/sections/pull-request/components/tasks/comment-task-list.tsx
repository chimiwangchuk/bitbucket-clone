import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, InjectedIntl } from 'react-intl';
import {
  getTasksForComment,
  getCanResolveTask,
  isCreateTaskInputVisible,
  getTasksSlice,
  getModifiableTasks,
} from 'src/selectors/task-selectors';
import {
  taskStateChange,
  TASK_DELETE,
  TOGGLE_EDIT_COMMENT_TASK_INPUT,
} from 'src/redux/pull-request/actions';
import { publishUiEvent } from 'src/utils/analytics/publish';
import { TaskStateChangeOptions } from 'src/redux/pull-request/types';
import { BucketState, BucketDispatch } from 'src/types/state';
import { Task } from 'src/components/types';
import {
  getTaskLocation,
  TaskMap,
  EditableTaskState,
} from 'src/redux/pull-request/tasks-reducer';
import { getCurrentRepositoryUuid } from 'src/selectors/repository-selectors';
import { getCurrentPullRequestId } from 'src/redux/pull-request/selectors';
import TaskComponent from './task';
import * as commentTaskStyle from './comment-task-list.style';
import { CreateTaskKind } from './create-task';
import { CreateCommentTask } from './create-comment-task';
import * as style from './tasks.style';
import { taskKey } from './utils';
import { EditCommentTask } from './edit-comment-task';

type OwnProps = {
  intl: InjectedIntl;
  commentId: string;
};

type CommentTaskListProps = OwnProps & {
  tasks: Task[];
  modifiableTaskKeys: string[];
  canResolveTask?: boolean;
  onTaskStateChange: (props: TaskStateChangeOptions) => void;
  onTaskDelete: (task: Task) => void;
  onTaskEditBegin: (task: Task) => void;
  isCreateTaskInputVisible: boolean;
  createTaskHasError: boolean;
  createTaskErrorMessage: string;
  isCreateTaskSubmitting: boolean;
  isDeleteTaskSubmitting: TaskMap<boolean>;
  commentEditingTasks: TaskMap<EditableTaskState>;
  pullRequestId: number | null;
  repositoryUUID: string | null;
};

const mapStateToProps = (state: BucketState, ownProps: OwnProps) => {
  const {
    createTaskHasErrorByTaskKey,
    createTaskErrorMessageByTaskKey,
    isCreateTaskSubmittingByTaskKey,
    isDeleteTaskSubmitting,
    commentEditingTasks,
  } = getTasksSlice(state);
  const { commentId } = ownProps;
  const taskLocation = getTaskLocation({ isGlobal: !commentId, commentId });
  return {
    repositoryUUID: getCurrentRepositoryUuid(state),
    pullRequestId: getCurrentPullRequestId(state),
    createTaskHasError: createTaskHasErrorByTaskKey[taskLocation],
    createTaskErrorMessage: createTaskErrorMessageByTaskKey[taskLocation],
    isCreateTaskSubmitting: isCreateTaskSubmittingByTaskKey[taskLocation],
    canResolveTask: getCanResolveTask(state),
    modifiableTaskKeys: getModifiableTasks(state),
    tasks: getTasksForComment(state, ownProps.commentId),
    isCreateTaskInputVisible: isCreateTaskInputVisible(
      state,
      ownProps.commentId
    ),
    isDeleteTaskSubmitting,
    commentEditingTasks,
  };
};

const mapDispatchToProps = (dispatch: BucketDispatch) => ({
  onTaskStateChange: (props: TaskStateChangeOptions) =>
    dispatch(taskStateChange(props)),
  onTaskDelete: (task: Task) =>
    dispatch({
      type: TASK_DELETE.REQUEST,
      payload: task,
    }),
  onTaskEditBegin: (task: Task) =>
    dispatch({
      type: TOGGLE_EDIT_COMMENT_TASK_INPUT,
      payload: {
        taskId: task.id,
        isEditing: true,
      },
    }),
});

export class BaseCommentTaskList extends React.PureComponent<
  CommentTaskListProps
> {
  handleTaskStateChange = (options: TaskStateChangeOptions) => {
    const { nextTaskState: state } = options;

    publishUiEvent({
      action: state === 'RESOLVED' ? 'resolved' : 'unresolved',
      actionSubject: 'task',
      actionSubjectId: 'pullRequestTask',
      source: 'pullRequestScreen',
      objectType: 'pullRequest',
      objectId: `${this.props.repositoryUUID}/${this.props.pullRequestId}`,
      containerId: `${this.props.repositoryUUID}`,
      containerType: 'repository',
      attributes: {
        taskLocation: 'comment',
      },
    });

    this.props.onTaskStateChange(options);
  };

  render() {
    const {
      tasks,
      onTaskDelete,
      onTaskEditBegin,
      modifiableTaskKeys,
      canResolveTask,
      isCreateTaskInputVisible: isTaskInputVisible,
      createTaskHasError,
      createTaskErrorMessage,
      isCreateTaskSubmitting,
      isDeleteTaskSubmitting,
      commentEditingTasks,
    } = this.props;

    return (
      <>
        {isTaskInputVisible && (
          <CreateCommentTask
            kind={CreateTaskKind.Comment}
            commentId={this.props.commentId}
            createTaskHasError={createTaskHasError}
            createTaskErrorMessage={createTaskErrorMessage}
            isCreateTaskSubmitting={isCreateTaskSubmitting}
          />
        )}
        {tasks && tasks.length ? (
          <commentTaskStyle.CommentTaskList>
            {tasks.map((task: Task) => {
              const key = taskKey(task);
              const commentTaskEditState = commentEditingTasks[task.id];
              const isEditing =
                commentTaskEditState &&
                commentTaskEditState.state !== 'notEditing';
              const canModify = modifiableTaskKeys.includes(key);
              return isEditing ? (
                <EditCommentTask key={key} task={task} />
              ) : (
                <style.TaskContainer key={key}>
                  <TaskComponent
                    key={key}
                    task={task}
                    isDeleting={isDeleteTaskSubmitting[key]}
                    onTaskDelete={canModify ? onTaskDelete : undefined}
                    onTaskEditBegin={canModify ? onTaskEditBegin : undefined}
                    canResolveTask={canResolveTask}
                    onTaskStateChange={this.handleTaskStateChange}
                  />
                </style.TaskContainer>
              );
            })}
          </commentTaskStyle.CommentTaskList>
        ) : null}
      </>
    );
  }
}

export const CommentTaskList = injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(BaseCommentTaskList)
);
