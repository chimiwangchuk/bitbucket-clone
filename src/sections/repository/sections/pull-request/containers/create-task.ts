import { connect } from 'react-redux';
import { getCurrentPullRequestId } from 'src/redux/pull-request/selectors';
import { getCurrentRepositoryUuid } from 'src/selectors/repository-selectors';
import { getTasksSlice, getCanCreateTask } from 'src/selectors/task-selectors';
import { BucketState, BucketDispatch } from 'src/types/state';
import { TASK_CREATE } from 'src/redux/pull-request/actions';
import { TASK_LOCATION_GLOBAL } from 'src/redux/pull-request/tasks-reducer';
import CreateTask from '../components/tasks/create-task';

const mapStateToProps = (state: BucketState) => {
  const {
    createTaskHasErrorByTaskKey,
    createTaskErrorMessageByTaskKey,
    isCreateTaskSubmittingByTaskKey,
  } = getTasksSlice(state);
  const pullRequestId = getCurrentPullRequestId(state);
  const repositoryUUID = getCurrentRepositoryUuid(state);

  return {
    canCreateTask: getCanCreateTask(state),
    createTaskHasError: createTaskHasErrorByTaskKey[TASK_LOCATION_GLOBAL],
    createTaskErrorMessage:
      createTaskErrorMessageByTaskKey[TASK_LOCATION_GLOBAL],
    isCreateTaskSubmitting:
      isCreateTaskSubmittingByTaskKey[TASK_LOCATION_GLOBAL],
    repositoryUUID,
    pullRequestId,
  };
};

export const mapDispatchToProps = (dispatch: BucketDispatch) => ({
  onTaskCreate: (task: string) => {
    dispatch({
      type: TASK_CREATE.REQUEST,
      payload: { task, isGlobal: true },
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateTask);
