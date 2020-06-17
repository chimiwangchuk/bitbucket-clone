import { createSelector, Selector } from 'reselect';

import { createAsyncAction } from 'src/redux/actions';
import { Diff } from 'src/types/pull-request';
import { Action, BucketState } from 'src/types/state';
import { isExcessiveSizeEntireFile } from 'src/utils/diff-classifications';

import { getPullRequestSlice } from './selectors';
import { prefixed } from './actions';

// Action Types

const CLOSE_VIEW_ENTIRE_FILE_DIALOG = prefixed('CLOSE_VIEW_ENTIRE_FILE_DIALOG');
export const FetchEntireFile = createAsyncAction(prefixed('FETCH_ENTIRE_FILE'));
export const VIEW_ENTIRE_FILE = prefixed('VIEW_ENTIRE_FILE');

export type ViewEntireFileAction = {
  readonly type: typeof VIEW_ENTIRE_FILE;
  payload: { path: string };
};

// Action Creators

export const closeViewEntireFileDialog = () => ({
  type: CLOSE_VIEW_ENTIRE_FILE_DIALOG,
});

export const viewEntireFile = (path: string): ViewEntireFileAction => ({
  type: VIEW_ENTIRE_FILE,
  payload: { path },
});

// Initial State (also used as type)

export const viewEntireFileInitialState = {
  hasError: false,
  isDialogOpen: false,
  isLoading: false,
  parsedDiffFile: null as Diff | null,
  path: null as string | null,
};

export type ViewEntireFileState = typeof viewEntireFileInitialState;

// Selectors

const getViewEntireFileSlice: Selector<
  BucketState,
  ViewEntireFileState
> = createSelector(
  getPullRequestSlice,
  pullRequestState => pullRequestState.viewEntireFile
);

export const getIsViewEntireFileLoading: Selector<
  BucketState,
  boolean
> = createSelector(getViewEntireFileSlice, state => state.isLoading);

export const getViewEntireFileHasError: Selector<
  BucketState,
  boolean
> = createSelector(getViewEntireFileSlice, state => state.hasError);

export const getViewEntireFileParsedDiffFile: Selector<
  BucketState,
  Diff | null
> = createSelector(getViewEntireFileSlice, state => state.parsedDiffFile);

export const getViewEntireFilePath: Selector<
  BucketState,
  string | null
> = createSelector(getViewEntireFileSlice, state => state.path);

export const getIsViewEntireFileDialogOpen: Selector<
  BucketState,
  boolean
> = createSelector(getViewEntireFileSlice, state => state.isDialogOpen);

export const getIsViewEntireFileTooLarge: Selector<
  BucketState,
  boolean
> = createSelector(getViewEntireFileParsedDiffFile, file =>
  file ? isExcessiveSizeEntireFile(file) : false
);

// Reducer
export default (
  state: ViewEntireFileState = viewEntireFileInitialState,
  action: Action
) => {
  switch (action.type) {
    // Reset the state upon closing the dialog so we don't hold the file contents in memory,
    // and to prevent a flash of the previous dialog's contents upon opening the next one
    case CLOSE_VIEW_ENTIRE_FILE_DIALOG:
      return {
        ...state,
        ...viewEntireFileInitialState,
      };
    case FetchEntireFile.REQUEST:
      return {
        ...state,
        hasError: false,
        isLoading: true,
        parsedDiffFile: null,
      };
    case FetchEntireFile.SUCCESS:
      return {
        ...state,
        hasError: false,
        isLoading: false,
        parsedDiffFile: action.payload[0],
      };
    case FetchEntireFile.ERROR:
      return {
        ...state,
        hasError: true,
        isLoading: false,
      };
    case VIEW_ENTIRE_FILE:
      return {
        ...state,
        isDialogOpen: true,
        path: action.payload.path,
      };
    default:
      return state;
  }
};
