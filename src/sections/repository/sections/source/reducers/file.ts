import createReducer from 'src/utils/create-reducer';

import {
  LoadFileContents,
  LoadFileMeta,
  LoadLfsInfo,
  UNLOAD_FILE,
} from '../actions';
import { File, FileMeta, LfsInfo } from '../types';

export type SourceFileState = {
  file?: File;
  lfs?: LfsInfo;
  meta?: FileMeta;
  isLoading: boolean;
};

const initialState: SourceFileState = {
  isLoading: false,
};

export default createReducer(initialState, {
  [LoadFileMeta.REQUEST](state) {
    return {
      ...state,
      file: undefined,
      meta: undefined,
      isLoading: true,
    };
  },

  [LoadFileMeta.SUCCESS](state, action) {
    const { attributes, path, mimetype, size } = action.payload;
    return {
      ...state,
      isLoading: false,
      meta: { attributes, path, mimetype, size },
    };
  },

  [LoadLfsInfo.REQUEST](state) {
    return {
      ...state,
      lfs: null,
    };
  },

  [LoadLfsInfo.SUCCESS](state, action) {
    return {
      ...state,
      lfs: action.payload,
    };
  },

  [LoadFileContents.SUCCESS](state, action) {
    return {
      ...state,
      file: { contents: action.payload },
    };
  },

  [UNLOAD_FILE]() {
    return initialState;
  },
});
