import { createSelector } from 'reselect';

import { Action } from 'src/types/state';
import { createAsyncAction } from 'src/redux/actions';

import { getPullRequestSlice } from './selectors';
import { prefixed } from './actions';

// Action Types
export const DECLINE = createAsyncAction(prefixed('DECLINE'));
export const OPEN_DECLINE_DIALOG = prefixed('OPEN_DECLINE_DIALOG');
export const CLOSE_DECLINE_DIALOG = prefixed('CLOSE_DECLINE_DIALOG');

// Action Creators
export const requestDecline = (reason: string) => ({
  type: DECLINE.REQUEST,
  payload: reason,
});
export const closeDialog = () => ({ type: CLOSE_DECLINE_DIALOG });
export const openDialog = () => ({ type: OPEN_DECLINE_DIALOG });

// Initial State (also used as type)
export const declineInitialState = {
  isRequesting: false,
  isDialogOpen: false,
  hadError: false,
  lastErrorMessage: null,
};

// Selectors
export const getIsDeclineDialogOpen = createSelector(
  getPullRequestSlice,
  state => state.decline.isDialogOpen
);
export const getIsDeclineRequesting = createSelector(
  getPullRequestSlice,
  state => state.decline.isRequesting
);
export const getIsDeclineErrored = createSelector(
  getPullRequestSlice,
  state => state.decline.hadError
);
export const getDeclineErrorMessage = createSelector(
  getPullRequestSlice,
  state => state.decline.lastErrorMessage
);

// Reducer
export default (
  state: typeof declineInitialState = declineInitialState,
  action: Action
) => {
  switch (action.type) {
    case OPEN_DECLINE_DIALOG:
      return {
        ...state,
        isDialogOpen: true,
      };
    case CLOSE_DECLINE_DIALOG:
      return {
        ...state,
        isDialogOpen: false,
        hadError: false,
        lastErrorMessage: null,
      };
    case DECLINE.REQUEST:
      return {
        ...state,
        isRequesting: true,
        hadError: false,
        lastErrorMessage: null,
      };
    case DECLINE.SUCCESS:
      return {
        ...declineInitialState,
      };
    case DECLINE.ERROR:
      return {
        ...state,
        isRequesting: false,
        hadError: true,
        lastErrorMessage: action.payload,
      };
    default:
      return state;
  }
};
