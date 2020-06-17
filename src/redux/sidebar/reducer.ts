import { createSelector } from 'reselect';

import { LoadGlobal } from 'src/redux/global/actions';
import {
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_EXPANDED_WIDTH,
} from 'src/sections/global/constants';
import { Action, BucketState } from 'src/types/state';

import { TOGGLE_SIDEBAR } from './actions';
import { SidebarType } from './types';

export type SidebarState = {
  [K in SidebarType]: {
    isOpen: boolean;
    width: number;
  };
};

// Selectors

export const getCodeReviewSidebarWidth = createSelector(
  (state: BucketState) => state.sidebar['code-review'],
  sidebarState => sidebarState.width
);

export const getCommitViewSidebarWidth = createSelector(
  (state: BucketState) => state.sidebar['commit-view'],
  sidebarState => sidebarState.width
);

export const getSourceSidebarWidth = createSelector(
  (state: BucketState) => state.sidebar.source,
  sidebarState => sidebarState.width
);

export const isCodeReviewSidebarOpen = createSelector(
  (state: BucketState) => state.sidebar['code-review'],
  sidebarState => sidebarState.isOpen
);

export const isCommitViewSidebarOpen = createSelector(
  (state: BucketState) => state.sidebar['commit-view'],
  sidebarState => sidebarState.isOpen
);

export const isSourceSidebarOpen = createSelector(
  (state: BucketState) => state.sidebar.source,
  sidebarState => sidebarState.isOpen
);

export const isSidebarOpen = createSelector(
  // @ts-ignore TODO: fix noImplicitAny error here
  (state, sidebarType: SidebarType) => state.sidebar[sidebarType],
  sidebarState => sidebarState.isOpen
);

export const getSidebarWidth = createSelector(
  // @ts-ignore TODO: fix noImplicitAny error here
  (state, sidebarType: SidebarType) => state.sidebar[sidebarType],
  sidebarState => sidebarState.width
);

// Reducer

const initialState: SidebarState = {
  'code-review': {
    isOpen: true,
    width: SIDEBAR_EXPANDED_WIDTH,
  },
  'commit-view': {
    isOpen: false,
    width: SIDEBAR_COLLAPSED_WIDTH,
  },
  source: {
    isOpen: false,
    width: SIDEBAR_COLLAPSED_WIDTH,
  },
};

const parseSidebarWidth = (width: string) => {
  const intWidth = parseInt(width, 10);
  if (isNaN(intWidth)) {
    return SIDEBAR_EXPANDED_WIDTH;
  }
  return intWidth;
};

export default (
  state: SidebarState = initialState,
  action: Action
): SidebarState => {
  switch (action.type) {
    case TOGGLE_SIDEBAR: {
      const { isOpen, sidebarType, width: newWidth } = action.payload;
      // @ts-ignore TODO: fix noImplicitAny error here
      const sidebarState = state[sidebarType];

      if (!sidebarState) {
        return state;
      }

      const newIsOpen = isOpen !== undefined ? isOpen : !sidebarState.isOpen;

      if (
        sidebarState.isOpen === newIsOpen &&
        sidebarState.width === newWidth
      ) {
        return state;
      }

      const newSidebarState = { ...sidebarState, isOpen: newIsOpen };

      if (newIsOpen && newWidth) {
        newSidebarState.width = newWidth;
      }

      return {
        ...state,
        [sidebarType]: newSidebarState,
      };
    }

    case LoadGlobal.SUCCESS: {
      const { result } = action.payload;
      return {
        ...state,
        'code-review': {
          ...state['code-review'],
          isOpen: result.isCodeReviewSidebarOpen,
          width: parseSidebarWidth(result.codeReviewSidebarWidth),
        },
        'commit-view': {
          ...state['commit-view'],
          isOpen: result.isCommitViewSidebarOpen,
          width: parseSidebarWidth(result.commitViewSidebarWidth),
        },
        source: {
          ...state.source,
          isOpen: result.isSourceBrowserSidebarOpen,
          width: parseSidebarWidth(result.sourceBrowserSidebarWidth),
        },
      };
    }

    default:
      return state;
  }
};
