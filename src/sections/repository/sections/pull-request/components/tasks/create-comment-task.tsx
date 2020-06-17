import React from 'react';
import { connect } from 'react-redux';
import {
  getCanCreateTask,
  getInitialTaskText,
} from 'src/selectors/task-selectors';
import {
  TASK_CREATE,
  taskStateChange,
  TOGGLE_CREATE_COMMENT_TASK_INPUT,
} from 'src/redux/pull-request/actions';
import { TaskStateChangeOptions } from 'src/redux/pull-request/types';
import { BucketState, BucketDispatch } from 'src/types/state';

import * as styles from './create-comment-task.style';
import CreateTask, { CreateTaskKind } from './create-task';

type OwnProps = {
  kind: CreateTaskKind;
  commentId: string;
};

type CommentTaskListProps = OwnProps & {
  canCreateTask: boolean;
  onTaskCreate: (task: string) => void;
  createTaskHasError: boolean;
  createTaskErrorMessage: string;
  isCreateTaskSubmitting: boolean;
  initialTaskText: string;
};

const mapStateToProps = (state: BucketState) => ({
  canCreateTask: getCanCreateTask(state),
  initialTaskText: getInitialTaskText(state),
});

const mapDispatchToProps = (dispatch: BucketDispatch) => ({
  onTaskStateChange: (props: TaskStateChangeOptions) =>
    dispatch(taskStateChange(props)),
  onTaskCreate: (task: string, commentId: string) => {
    dispatch({
      type: TASK_CREATE.REQUEST,
      payload: {
        task,
        commentId,
      },
    });
  },
  onBlur: (task: string, commentId?: string) => {
    if (commentId && !task) {
      dispatch({
        type: TOGGLE_CREATE_COMMENT_TASK_INPUT,
        payload: {
          commentId,
          isCreating: false,
        },
      });
    }
  },
});

class BaseCreateCommentTask extends React.PureComponent<CommentTaskListProps> {
  render() {
    return (
      <styles.CreateCommentTask>
        <CreateTask {...this.props} />
      </styles.CreateCommentTask>
    );
  }
}

export const CreateCommentTask = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseCreateCommentTask);
