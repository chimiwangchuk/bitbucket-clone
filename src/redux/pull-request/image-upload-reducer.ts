import { createSelector } from 'reselect';
import { Action } from 'src/types/state';
import { createAsyncAction } from 'src/redux/actions';

import { File } from './bitbucket-image-upload-handler';
import { prefixed } from './actions';
import { getPullRequestSlice } from './selectors';

// Actions
export const CHOOSE_IMAGE = prefixed('CHOOSE_IMAGE');
export const CANCEL_IMAGE_CHOICE = prefixed('CANCEL_IMAGE_CHOICE');
export const UPLOAD_IMAGE = createAsyncAction(prefixed('UPLOAD_IMAGE'));

export const chooseImage = (editorCallback: () => void) => ({
  type: CHOOSE_IMAGE,
  payload: { editorCallback },
});

export const uploadImage = (file: File, editorCallback?: () => void) => ({
  type: UPLOAD_IMAGE.REQUEST,
  payload: { file, editorCallback },
});

// Initial State
export const imageUploadInitialState = {
  isChoosingImage: false,
  errorMessage: null,
};

// Selectors
export const getIsUploadImageDialogOpen = createSelector(
  getPullRequestSlice,
  state => state.imageUpload.isChoosingImage
);

export const getImageUploadError = createSelector(
  getPullRequestSlice,
  state => state.imageUpload.errorMessage
);

// Reducer
export default (
  state: typeof imageUploadInitialState = imageUploadInitialState,
  action: Action
) => {
  switch (action.type) {
    case CHOOSE_IMAGE:
      return {
        ...state,
        isChoosingImage: true,
        errorMessage: null,
      };
    case CANCEL_IMAGE_CHOICE:
      return { ...imageUploadInitialState };
    case UPLOAD_IMAGE.SUCCESS:
      return { ...imageUploadInitialState };
    case UPLOAD_IMAGE.ERROR:
      return {
        ...state,
        errorMessage: action.payload,
      };
    default:
      return state;
  }
};
