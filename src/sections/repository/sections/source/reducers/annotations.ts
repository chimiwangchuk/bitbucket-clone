import createReducer from 'src/utils/create-reducer';

import { Action } from 'src/types/state';
import { LoadAnnotators, LoadAnnotations } from '../actions';
import { Annotator, Annotation } from '../types';

export type AnnotationsState = {
  annotators: Annotator[];
  annotations: Annotation[];
  isLoadingAnnotations: boolean;
};

const initialState: AnnotationsState = {
  annotators: [],
  annotations: [],
  isLoadingAnnotations: true,
};

// Note: The createReducer util uses an 'any' type, so trying to define a payload
// type below causes Flow errors.
export default createReducer(initialState, {
  [LoadAnnotators.SUCCESS](state: AnnotationsState, action: Action) {
    return {
      ...state,
      annotators: action.payload,
    };
  },

  [LoadAnnotations.REQUEST](state: AnnotationsState) {
    return {
      ...state,
      isLoadingAnnotations: true,
    };
  },

  [LoadAnnotations.SUCCESS](state: AnnotationsState, action: Action) {
    return {
      ...state,
      annotations: action.payload,
      isLoadingAnnotations: false,
    };
  },
});
