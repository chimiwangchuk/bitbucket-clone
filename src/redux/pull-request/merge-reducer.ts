import { createSelector } from 'reselect';
import { Action } from 'src/types/state';
import { createAsyncAction, fetchAction } from 'src/redux/actions';
import { MergeInfo } from 'src/types/pull-request';
import { getPullRequestSlice } from './selectors';
import { prefixed, EXITED_CODE_REVIEW } from './actions';

// Action Types
export const MERGE = createAsyncAction(prefixed('MERGE'));
export const FETCH_PENDING_MERGE_STATUS = createAsyncAction(
  prefixed('FETCH_PENDING_MERGE_STATUS')
);
export const CREATE_PENDING_MERGE = createAsyncAction(
  prefixed('CREATE_PENDING_MERGE')
);
export const CANCEL_PENDING_MERGE = createAsyncAction(
  prefixed('CANCEL_PENDING_MERGE')
);
export const OPEN_MERGE_DIALOG = prefixed('OPEN_MERGE_DIALOG');
export const CLOSE_MERGE_DIALOG = prefixed('CLOSE_MERGE_DIALOG');
export const FETCH_STACKED_PULL_REQUESTS_COUNT = createAsyncAction(
  prefixed('FETCH_STACKED_PULL_REQUESTS_COUNT')
);
export const SET_ASYNC_MERGE_IN_PROGRESS = prefixed(
  'SET_ASYNC_MERGE_IN_PROGRESS'
);
export const SET_PULL_REQUEST_MERGE_STATUS_POLLING_LINK = prefixed(
  'SET_PULL_REQUEST_MERGE_STATUS_POLLING_LINK'
);
export const FETCH_PULL_REQUEST_MERGE_STATUS = createAsyncAction(
  prefixed('FETCH_PULL_REQUEST_MERGE_STATUS')
);

// Action Creators
export const requestMerge = (mergeInfo: MergeInfo) => ({
  type: MERGE.REQUEST,
  payload: mergeInfo,
});
export const fetchPendingMergeStatus = () => ({
  type: FETCH_PENDING_MERGE_STATUS.REQUEST,
});
export const createPendingMerge = (mergeInfo: MergeInfo) => ({
  type: CREATE_PENDING_MERGE.REQUEST,
  payload: mergeInfo,
});
export const cancelPendingMerge = () => ({
  type: CANCEL_PENDING_MERGE.REQUEST,
});
export const fetchStackedPullRequests = () => ({
  type: FETCH_STACKED_PULL_REQUESTS_COUNT.REQUEST,
});
export const setAsyncMergeInProgress = (isAsyncMergeInProgress: boolean) => ({
  type: SET_ASYNC_MERGE_IN_PROGRESS,
  payload: isAsyncMergeInProgress,
});

export const fetchPullRequestMergeStatus = (pollingLink: string) =>
  fetchAction(FETCH_PULL_REQUEST_MERGE_STATUS, {
    url: pollingLink,
    cache: { ttl: 0 },
  });

export const closeDialog = () => ({ type: CLOSE_MERGE_DIALOG });
export const openDialog = () => ({ type: OPEN_MERGE_DIALOG });

// Initial State (also used as type)
export type MergeState = {
  canCreatePendingMerge: boolean;
  hadError: boolean;
  isDialogOpen: boolean;
  isMergePending: boolean;
  isAsyncMergeInProgress: boolean;
  isRequesting: boolean;
  isRequestingPendingMerge: boolean;
  lastErrorMessage: string | null;
  mergeInfo: MergeInfo;
  stackedPullRequestsCount: number;
};

export const mergeInitialState: MergeState = {
  canCreatePendingMerge: false,
  hadError: false,
  isDialogOpen: false,
  isMergePending: false,
  isAsyncMergeInProgress: false,
  isRequesting: false,
  isRequestingPendingMerge: false,
  lastErrorMessage: null,
  mergeInfo: {},
  stackedPullRequestsCount: 0,
};

// Selectors
export const getIsMergeDialogOpen = createSelector(
  getPullRequestSlice,
  state => state.merge.isDialogOpen
);
export const getIsMergeRequesting = createSelector(
  getPullRequestSlice,
  state => state.merge.isRequesting
);
export const getIsRequestingPendingMerge = createSelector(
  getPullRequestSlice,
  state => state.merge.isRequestingPendingMerge
);
export const getIsMergeErrored = createSelector(
  getPullRequestSlice,
  state => state.merge.hadError
);
export const getMergeErrorMessage = createSelector(
  getPullRequestSlice,
  state => state.merge.lastErrorMessage
);
export const getCanCreatePendingMerge = createSelector(
  getPullRequestSlice,
  state => state.merge.canCreatePendingMerge
);
export const getIsMergePending = createSelector(
  getPullRequestSlice,
  state => state.merge.isMergePending
);
export const getMergeInfo = createSelector(
  getPullRequestSlice,
  state => state.merge.mergeInfo
);
export const getStackedPullRequestsCount = createSelector(
  getPullRequestSlice,
  state => state.merge.stackedPullRequestsCount
);
export const getIsAsyncMergeInProgress = createSelector(
  getPullRequestSlice,
  state => state.merge.isAsyncMergeInProgress
);

// Reducer
export default (
  state: typeof mergeInitialState = mergeInitialState,
  action: Action
) => {
  switch (action.type) {
    case OPEN_MERGE_DIALOG:
      return {
        ...state,
        isDialogOpen: true,
      };
    case CLOSE_MERGE_DIALOG:
      return {
        ...state,
        isDialogOpen: false,
        hadError: false,
        lastErrorMessage: null,
      };
    case MERGE.REQUEST:
      return {
        ...state,
        isRequesting: true,
        hadError: false,
        lastErrorMessage: null,
      };
    case MERGE.SUCCESS:
      return {
        ...mergeInitialState,
      };
    case MERGE.ERROR:
      return {
        ...state,
        isRequesting: false,
        hadError: true,
        lastErrorMessage: action.payload,
      };
    case FETCH_PENDING_MERGE_STATUS.REQUEST:
      return {
        ...state,
        isRequestingPendingMerge: true,
        hadError: false,
        lastErrorMessage: null,
      };
    case FETCH_PENDING_MERGE_STATUS.SUCCESS:
      return {
        ...mergeInitialState,
        canCreatePendingMerge: action.payload.canCreatePendingMerge,
        isMergePending: action.payload.isMergePending,
        mergeInfo: action.payload.mergeInfo,
      };
    case FETCH_PENDING_MERGE_STATUS.ERROR:
      return {
        ...state,
        isRequestingPendingMerge: false,
        hadError: true,
        lastErrorMessage: action.payload,
      };
    case CREATE_PENDING_MERGE.REQUEST:
      return {
        ...state,
        isRequestingPendingMerge: true,
        hadError: false,
        lastErrorMessage: null,
      };
    case CREATE_PENDING_MERGE.SUCCESS:
      return {
        ...mergeInitialState,
        isMergePending: true,
        mergeInfo: action.payload,
      };
    case CREATE_PENDING_MERGE.ERROR:
      return {
        ...state,
        isRequestingPendingMerge: false,
        hadError: true,
        lastErrorMessage: action.payload,
      };
    case CANCEL_PENDING_MERGE.REQUEST:
      return {
        ...state,
        isRequestingPendingMerge: true,
        hadError: false,
        lastErrorMessage: null,
      };
    case CANCEL_PENDING_MERGE.SUCCESS:
      return {
        ...mergeInitialState,
      };
    case CANCEL_PENDING_MERGE.ERROR:
      return {
        ...state,
        isRequestingPendingMerge: false,
        hadError: true,
        lastErrorMessage: action.payload,
      };
    case FETCH_STACKED_PULL_REQUESTS_COUNT.SUCCESS:
      return {
        ...state,
        stackedPullRequestsCount: action.payload,
      };
    case FETCH_STACKED_PULL_REQUESTS_COUNT.ERROR:
      return {
        ...state,
        // Ignore errors, show as if there're no stacked PRs
        stackedPullRequestsCount: 0,
      };
    case SET_ASYNC_MERGE_IN_PROGRESS:
      return {
        ...state,
        isAsyncMergeInProgress: action.payload,
      };
    case EXITED_CODE_REVIEW:
      return {
        ...mergeInitialState,
      };
    default:
      return state;
  }
};
