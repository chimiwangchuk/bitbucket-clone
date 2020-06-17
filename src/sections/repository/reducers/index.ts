import { combineReducers } from 'redux';
import {
  reducer as commitListReducer,
  CommitListState,
} from 'src/redux/commit-list';
import {
  reducer as pendingCommit,
  PendingCommitState,
} from 'src/redux/pending-commit';
import pullRequest, { PullRequestState } from 'src/redux/pull-request/reducer';
import activityReducer from 'src/redux/pull-request/activity-reducer';
import declineReducer from 'src/redux/pull-request/decline-reducer';
import mergeReducer from 'src/redux/pull-request/merge-reducer';
import imageUploadReducer from 'src/redux/pull-request/image-upload-reducer';
import pullRequestList, {
  PullRequestListState,
} from 'src/redux/pull-request-list';
import branches, { BranchesState } from 'src/redux/branches/reducers';

import pollingReducer from 'src/redux/pull-request/polling-reducer';
import tasksReducer from 'src/redux/pull-request/tasks-reducer';
import viewEntireFileReducer from 'src/redux/pull-request/view-entire-file-reducer';
import source, { SourceState } from '../sections/source/reducers';
import details, { RepositoryDetailsState } from './details';
import section, { RepositorySectionState } from './section';
import subscriptions, { RepositorySubscriptionsState } from './subscriptions';

export type RepositoryState = {
  commitList: CommitListState;
  details: RepositoryDetailsState;
  pendingCommit: PendingCommitState;
  pullRequest: PullRequestState;
  pullRequestList: PullRequestListState;
  branches: BranchesState;
  section: RepositorySectionState;
  source: SourceState;
  subscriptions: RepositorySubscriptionsState;
};

const reducer = combineReducers<RepositoryState>({
  commitList: commitListReducer,
  details,
  pendingCommit,
  // Interim duct tape to append reducer to parent slice
  pullRequest: (state: PullRequestState, action): PullRequestState => ({
    ...pullRequest(state, action),
    decline: declineReducer(state ? state.decline : undefined, action),
    merge: mergeReducer(state ? state.merge : undefined, action),
    imageUpload: imageUploadReducer(
      state ? state.imageUpload : undefined,
      action
    ),
    activity: activityReducer(state ? state.activity : undefined, action),
    polling: pollingReducer(state ? state.polling : undefined, action),
    tasks: tasksReducer(state ? state.tasks : undefined, action),
    viewEntireFile: viewEntireFileReducer(
      state ? state.viewEntireFile : undefined,
      action
    ),
  }),
  pullRequestList,
  branches,
  section,
  source,
  subscriptions,
});

export default reducer;
