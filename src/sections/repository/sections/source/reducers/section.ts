import { createSelector } from 'reselect';

import { Ref } from 'src/sections/repository/types';
import { BucketState } from 'src/types/state';
import createReducer from 'src/utils/create-reducer';

import fileTreeId from '../utils/file-tree-id';

import {
  FetchDiff,
  FetchFileTree,
  FetchSource,
  FilterFiles,
  LoadFileTree,
  LoadSourceObject,
  UNLOAD_DIFF,
  UNLOAD_SOURCE,
} from '../actions';
import { FileTree, FilteredFiles, SourceObject } from '../types';

export type SourceSectionState = {
  atRef?: Ref;
  diff?: string;
  filteredFiles: FilteredFiles | null | undefined;
  filterQuery: string | null | undefined;
  hash?: string;
  isLoading: boolean;
  ref?: Ref;
  sourceHash?: string;
  fileTree: FileTree | null | undefined;
  sourceObject: SourceObject | null | undefined;
  showCloneGuidance?: boolean;
};

const initialState: SourceSectionState = {
  isLoading: false,
  filteredFiles: null,
  filterQuery: null,
  fileTree: null,
  sourceObject: null,
};

export const getSectionState = (state: BucketState) =>
  state.repository.source.section;

export const getFileTree = createSelector(
  getSectionState,
  section => section.fileTree
);
export const getFilteredFiles = createSelector(
  getSectionState,
  section => section.filteredFiles
);
export const getFilterQuery = createSelector(
  getSectionState,
  section => section.filterQuery
);

export default createReducer(initialState, {
  [FetchDiff.REQUEST](state) {
    return {
      ...state,
      isLoading: true,
    };
  },

  [FetchDiff.SUCCESS](state, action) {
    return {
      ...state,
      ...action.payload,
      isLoading: false,
    };
  },

  [FetchSource.REQUEST](state) {
    return {
      ...state,
      isLoading: true,
    };
  },

  [FetchSource.SUCCESS](state, action) {
    return {
      ...state,
      ...action.payload,
      isLoading: false,
    };
  },

  [FilterFiles.REQUEST](state, action) {
    return {
      ...state,
      filterQuery: action.payload,
    };
  },

  [FilterFiles.SUCCESS](state, action) {
    return {
      ...state,
      filteredFiles: action.payload,
    };
  },

  [FilterFiles.ERROR](state, action) {
    return {
      ...state,
      filteredFiles: action.payload,
    };
  },

  [LoadFileTree.REQUEST](state, action) {
    const { repository, hash } = action.payload;
    if (state.fileTree && state.fileTree.id !== fileTreeId(repository, hash)) {
      return {
        ...state,
        fileTree: null,
      };
    }
    return state;
  },

  [FetchFileTree.SUCCESS](state, action) {
    const { meta, payload } = action;
    return {
      ...state,
      fileTree: {
        id: meta && meta.data.treeId,
        tree: payload[0],
      },
    };
  },

  [FetchFileTree.ERROR](state, action) {
    const { meta } = action;
    return {
      ...state,
      fileTree: {
        id: meta && meta.data.treeId,
        tree: null,
      },
    };
  },

  [LoadSourceObject.REQUEST](state) {
    return {
      ...state,
      sourceObject: {
        ...state.sourceObject,
        isLoading: true,
        errorCode: null,
      },
    };
  },

  [LoadSourceObject.SUCCESS](state, action) {
    return {
      ...state,
      sourceObject: {
        ...action.payload,
        isLoading: false,
        errorCode: null,
      },
    };
  },

  [LoadSourceObject.ERROR](state, action) {
    return {
      ...state,
      sourceObject: {
        ...state.sourceObject,
        ...action.payload,
        isLoading: false,
        treeEntry: null,
      },
    };
  },

  [UNLOAD_DIFF](state) {
    return {
      ...state,
      diff: null,
    };
  },

  [UNLOAD_SOURCE](state) {
    return {
      ...state,
      atRef: undefined,
      hash: undefined,
      ref: undefined,
      fileTree: null,
      sourceObject: null,
    };
  },
});
