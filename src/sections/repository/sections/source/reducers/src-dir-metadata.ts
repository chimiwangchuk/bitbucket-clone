import createReducer from 'src/utils/create-reducer';

import { FetchSourceDirMetadata } from '../actions';
import { SrcDirMetadata } from '../types';

export type SourceDirMetadataState = {
  [refAndPath: string]: SrcDirMetadata;
};

const initialState: SourceDirMetadataState = {};

export default createReducer(initialState, {
  [FetchSourceDirMetadata.REQUEST](state, action) {
    const { ref, path } = action.payload;
    const id = `${ref}:${path}`;
    return {
      ...state,
      [id]: {
        ...state[id],
        isLoading: true,
      },
    };
  },

  [FetchSourceDirMetadata.SUCCESS](state, action) {
    const { ref, path, srcDirMetadata } = action.payload;
    const id = `${ref}:${path}`;
    return {
      ...state,
      [id]: {
        ...state[id],
        data: srcDirMetadata,
        isLoading: false,
      },
    };
  },
});
