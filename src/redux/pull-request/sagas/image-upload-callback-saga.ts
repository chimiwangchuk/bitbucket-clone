import { take, call } from 'redux-saga/effects';
import {
  CANCEL_IMAGE_CHOICE,
  CHOOSE_IMAGE,
  UPLOAD_IMAGE,
} from '../image-upload-reducer';

/**
 * Fabric editor requires a callback be invoked for a successfully
 * uploaded image, with src, title, and alt properties. The callback is specific
 * to the editor instance so this saga remembers the current one and forgets it
 * whenever the user backs out or completes the flow.
 */
export function* rememberImageUploadCallbacks() {
  while (true) {
    // If user opens the dialog or drops a file in, remember the editor callback
    const initiatingAction = yield take([CHOOSE_IMAGE, UPLOAD_IMAGE.REQUEST]);
    const { editorCallback } = initiatingAction.payload;

    // Wait until they cancel, successfully upload, or fail to upload
    const { type, payload } = yield take([
      CANCEL_IMAGE_CHOICE,
      UPLOAD_IMAGE.SUCCESS,
      UPLOAD_IMAGE.ERROR,
    ]);

    // If they sucessfully uploaded, invoke Fabric callback
    if (type === UPLOAD_IMAGE.SUCCESS) {
      yield call(editorCallback, { ...payload });
    }
  }
}
