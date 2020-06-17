import { put, take, race } from 'redux-saga/effects';

import { FetchAction } from 'src/redux/actions';

export default function*(action: FetchAction) {
  const result = yield put(action);
  // It might already be a SUCCESS, e.g. if the response was cached
  const {
    type,
    meta: { asyncAction },
  } = result;
  if (type === asyncAction.SUCCESS) {
    return result;
  }
  const { success, error } = yield race({
    success: take(asyncAction.SUCCESS),
    error: take(asyncAction.ERROR),
  });
  return success || error;
}
