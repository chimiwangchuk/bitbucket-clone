import { createSelector, Selector } from 'reselect';

import { LoadGlobal } from 'src/redux/global/actions';
import { BucketState } from 'src/types/state';

export enum DiffViewMode {
  Unified = 'UNIFIED',
  SideBySide = 'SIDE_BY_SIDE',
}

type UpdateSettingsPayload = {
  diffViewMode: DiffViewMode;
  isWordDiffEnabled: boolean;
  isColorBlindModeEnabled: boolean;
  shouldIgnoreWhitespace: boolean;
  isAnnotationsEnabled: boolean;
};

// Actions

const TOGGLE_SETTINGS_DIALOG = 'pullRequestSettings/TOGGLE_SETTINGS_DIALOG';
export const UPDATE_GLOBAL_DIFF_VIEW_MODE_SUCCESS =
  'pullRequestSettings/UPDATE_GLOBAL_DIFF_VIEW_MODE_SUCCESS';
export const UPDATE_GLOBAL_IS_WORD_DIFF_ENABLED_SUCCESS =
  'pullRequestSettings/UPDATE_GLOBAL_IS_WORD_DIFF_ENABLED_SUCCESS';
export const UPDATE_GLOBAL_SHOULD_IGNORE_WHITESPACE_SUCCESS =
  'pullRequestSettings/UPDATE_GLOBAL_SHOULD_IGNORE_WHITESPACE_SUCCESS';
export const UPDATE_GLOBAL_IS_COLOR_BLIND_MODE_ENABLED_SUCCESS =
  'pullRequestSettings/UPDATE_GLOBAL_IS_COLOR_BLIND_MODE_ENABLED_SUCCESS';
export const UPDATE_GLOBAL_IS_ANNOTATIONS_ENABLED_SUCCESS =
  'pullRequestSettings/UPDATE_GLOBAL_IS_ANNOTATIONS_ENABLED_SUCCESS';
export const UPDATE_SETTINGS_REQUEST =
  'pullRequestSettings/UPDATE_SETTINGS_REQUEST';
export const UPDATE_SETTINGS_SUCCESS =
  'pullRequestSettings/UPDATE_SETTINGS_SUCCESS';

type ToggleSettingsDialogAction = {
  readonly type: typeof TOGGLE_SETTINGS_DIALOG;
  payload: { isOpen: boolean };
};

export type UpdateGlobalDiffViewModeSuccessAction = {
  readonly type: typeof UPDATE_GLOBAL_DIFF_VIEW_MODE_SUCCESS;
  payload: { diffViewMode: DiffViewMode };
};

export type UpdateGlobalIsWordDiffEnabledSuccessAction = {
  readonly type: typeof UPDATE_GLOBAL_IS_WORD_DIFF_ENABLED_SUCCESS;
  payload: { isWordDiffEnabled: boolean };
};

export type UpdateGlobalIsColorBlindNodeEnabledSuccessAction = {
  readonly type: typeof UPDATE_GLOBAL_IS_COLOR_BLIND_MODE_ENABLED_SUCCESS;
  payload: { isColorBlindModeEnabled: boolean };
};

export type UpdateGlobalShouldIgnoreWhitespaceSuccessAction = {
  readonly type: typeof UPDATE_GLOBAL_SHOULD_IGNORE_WHITESPACE_SUCCESS;
  payload: { shouldIgnoreWhitespace: boolean };
};
export type UpdateGlobalIsAnnotationsEnabledSuccessAction = {
  readonly type: typeof UPDATE_GLOBAL_IS_ANNOTATIONS_ENABLED_SUCCESS;
  payload: { isAnnotationsEnabled: boolean };
};

export type UpdateSettingsRequestAction = {
  readonly type: typeof UPDATE_SETTINGS_REQUEST;
  payload: UpdateSettingsPayload;
};

export type UpdateSettingsSuccessAction = {
  readonly type: typeof UPDATE_SETTINGS_SUCCESS;
};

type PullRequestSettingsAction =
  | ToggleSettingsDialogAction
  | UpdateGlobalDiffViewModeSuccessAction
  | UpdateGlobalIsWordDiffEnabledSuccessAction
  | UpdateGlobalShouldIgnoreWhitespaceSuccessAction
  | UpdateGlobalIsColorBlindNodeEnabledSuccessAction
  | UpdateGlobalIsAnnotationsEnabledSuccessAction
  | UpdateSettingsRequestAction
  | UpdateSettingsSuccessAction;

// Action Creators

export const toggleSettingsDialog = (isOpen: boolean) => ({
  type: TOGGLE_SETTINGS_DIALOG,
  payload: { isOpen },
});

export const updateSettings = (
  settings: UpdateSettingsPayload
): UpdateSettingsRequestAction => ({
  type: UPDATE_SETTINGS_REQUEST,
  payload: settings,
});

// Selectors + Reducer

const initialState = {
  globalDiffViewMode: DiffViewMode.Unified,
  globalIsWordDiffEnabled: true,
  globalShouldIgnoreWhitespace: false,
  globalIsColorBlindModeEnabled: false,
  globalIsAnnotationsEnabled: false,
  isDialogLoading: false,
  isDialogOpen: false,
};

export type PullRequestSettingsState = typeof initialState;

const getPullRequestSettingsSlice = (state: BucketState) =>
  state.pullRequestSettings;

export const getIsPullRequestSettingsDialogLoading: Selector<
  BucketState,
  boolean
> = createSelector(
  getPullRequestSettingsSlice,
  (state: PullRequestSettingsState) => state.isDialogLoading
);

export const getIsPullRequestSettingsDialogOpen: Selector<
  BucketState,
  boolean
> = createSelector(
  getPullRequestSettingsSlice,
  (state: PullRequestSettingsState) => state.isDialogOpen
);

export const getGlobalDiffViewMode: Selector<
  BucketState,
  DiffViewMode
> = createSelector(
  getPullRequestSettingsSlice,
  (state: PullRequestSettingsState) => state.globalDiffViewMode
);

export const getGlobalIsWordDiffEnabled: Selector<
  BucketState,
  boolean
> = createSelector(
  getPullRequestSettingsSlice,
  (state: PullRequestSettingsState) => state.globalIsWordDiffEnabled
);

export const getGlobalIsColorBlindModeEnabled: Selector<
  BucketState,
  boolean
> = createSelector(
  getPullRequestSettingsSlice,
  (state: PullRequestSettingsState) => state.globalIsColorBlindModeEnabled
);

export const getGlobalShouldIgnoreWhitespace: Selector<
  BucketState,
  boolean
> = createSelector(
  getPullRequestSettingsSlice,
  (state: PullRequestSettingsState) => state.globalShouldIgnoreWhitespace
);

export const getGlobalIsAnnotationsEnabled: Selector<
  BucketState,
  boolean
> = createSelector(
  getPullRequestSettingsSlice,
  (state: PullRequestSettingsState) => state.globalIsAnnotationsEnabled
);

export const reducer = (
  state: PullRequestSettingsState = initialState,
  action: PullRequestSettingsAction
): PullRequestSettingsState => {
  switch (action.type) {
    case LoadGlobal.SUCCESS: {
      const {
        isPullRequestIgnoreWhitespaceEnabled,
        isPullRequestWordDiffEnabled,
        pullRequestDiffViewMode,
        isPullRequestColorBlindModeEnabled,
        isPullRequestAnnotationsEnabled,
        // The reducer takes advantage of const assertions and discriminated unions, and AsyncActions
        // like `LoadGlobal` aren't yet compatible with those
        // @ts-ignore
      } = action.payload.result;

      return {
        ...state,
        // explicitly make sure a valid enum is used (the preference value from the server can technically be anything)
        globalDiffViewMode:
          pullRequestDiffViewMode === DiffViewMode.SideBySide
            ? DiffViewMode.SideBySide
            : state.globalDiffViewMode,
        globalIsWordDiffEnabled: isPullRequestWordDiffEnabled,
        globalShouldIgnoreWhitespace: isPullRequestIgnoreWhitespaceEnabled,
        globalIsColorBlindModeEnabled: isPullRequestColorBlindModeEnabled,
        globalIsAnnotationsEnabled: isPullRequestAnnotationsEnabled,
      };
    }

    case TOGGLE_SETTINGS_DIALOG: {
      return {
        ...state,
        isDialogOpen: action.payload.isOpen,
      };
    }

    case UPDATE_GLOBAL_DIFF_VIEW_MODE_SUCCESS: {
      return {
        ...state,
        globalDiffViewMode: action.payload.diffViewMode,
      };
    }

    case UPDATE_GLOBAL_IS_WORD_DIFF_ENABLED_SUCCESS: {
      return {
        ...state,
        globalIsWordDiffEnabled: action.payload.isWordDiffEnabled,
      };
    }

    case UPDATE_GLOBAL_IS_COLOR_BLIND_MODE_ENABLED_SUCCESS: {
      return {
        ...state,
        globalIsColorBlindModeEnabled: action.payload.isColorBlindModeEnabled,
      };
    }

    case UPDATE_GLOBAL_SHOULD_IGNORE_WHITESPACE_SUCCESS: {
      return {
        ...state,
        globalShouldIgnoreWhitespace: action.payload.shouldIgnoreWhitespace,
      };
    }

    case UPDATE_GLOBAL_IS_ANNOTATIONS_ENABLED_SUCCESS: {
      return {
        ...state,
        globalIsAnnotationsEnabled: action.payload.isAnnotationsEnabled,
      };
    }

    case UPDATE_SETTINGS_REQUEST: {
      return {
        ...state,
        isDialogLoading: true,
      };
    }

    case UPDATE_SETTINGS_SUCCESS: {
      return {
        ...state,
        isDialogLoading: false,
        isDialogOpen: false,
      };
    }

    default:
      return state;
  }
};
