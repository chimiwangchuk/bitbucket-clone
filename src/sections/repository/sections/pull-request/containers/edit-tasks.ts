import { connect } from 'react-redux';
import {
  getTasksSlice,
  getUniqueTasksErrorMessages,
  getModifiableTasks,
  getCanEditSomeTasks,
} from 'src/selectors/task-selectors';
import { BucketState, BucketDispatch } from 'src/types/state';
import {
  TASKS_EDIT,
  TASK_DELETE,
  TASKS_CLEAR_ERRORS,
} from 'src/redux/pull-request/actions';
import { Task } from 'src/components/types';
import { EditTasks } from '../components/tasks/edit-tasks';

const mapStateToProps = (state: BucketState) => {
  const {
    editTasksHasErrors,
    taskErrors,
    isEditTasksSubmitting,
    isDeleteTaskSubmitting,
  } = getTasksSlice(state);
  return {
    taskErrors,
    tasksErrorMessages: getUniqueTasksErrorMessages(state),
    editTasksHasErrors,
    isEditTasksSubmitting,
    isDeleteTaskSubmitting,
    modifiableTasks: getModifiableTasks(state),
    canEditSomeTasks: getCanEditSomeTasks(state),
  };
};

export const mapDispatchToProps = (dispatch: BucketDispatch) => ({
  onTasksSave: (editTasksFormData: { [key: string]: string }) => {
    dispatch({
      type: TASKS_EDIT.REQUEST,
      payload: editTasksFormData,
    });
  },
  onTaskDelete: (task: Task) => {
    dispatch({
      type: TASK_DELETE.REQUEST,
      payload: task,
    });
  },
  clearTaskErrors: () => {
    dispatch({
      type: TASKS_CLEAR_ERRORS,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditTasks);
