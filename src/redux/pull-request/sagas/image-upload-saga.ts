import { call, select, put } from 'redux-saga/effects';
import { Action } from 'src/types/state';
import authRequest from 'src/utils/fetch';
import { getCurrentPullRequestUrlPieces } from 'src/redux/pull-request/selectors';
import urls from 'src/redux/pull-request/urls';
import { UPLOAD_IMAGE } from '../image-upload-reducer';

/**
 * When an upload image request happens, this sends the file to btibucket
 * then reports the success with the src, title, and alt fields
 * or reports an error
 */
export function* imageUploaderSaga(action: Action) {
  const { payload } = action;
  const { owner, slug } = yield select(getCurrentPullRequestUrlPieces);
  const uploadUrl = urls.api.internal.imageUpload(owner, slug);
  const imageUploadUrl = authRequest(uploadUrl);

  const data = new FormData();

  // need to modify file name as parenthesis broke image upload.
  // See https://softwareteams.atlassian.net/browse/NPR-837
  const fileName = payload.file.name
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');

  data.append('file', payload.file, fileName);

  try {
    const response = yield call(fetch, imageUploadUrl, {
      method: 'POST',
      body: data,
    });

    if (!response.ok) {
      const error = yield response.text();
      throw new Error(error);
    }

    const json = yield response.json();
    yield put({
      type: UPLOAD_IMAGE.SUCCESS,
      payload: {
        src: json.href,
        alt: json.filename,
        title: json.filename,
      },
    });
  } catch (e) {
    yield put({
      type: UPLOAD_IMAGE.ERROR,
      payload: e.message,
    });
  }
}
