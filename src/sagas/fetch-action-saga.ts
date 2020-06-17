import { takeEvery, takeLatest, call, put } from 'redux-saga/effects';

import { FetchAction } from 'src/redux/actions';
import authRequest, { jsonHeaders } from 'src/utils/fetch';

export function* loadData(action: FetchAction) {
  const { url, asyncAction, fetchOptions = {}, isRouterResource } = action.meta;

  if (isRouterResource) {
    return;
  }

  const {
    responseType = 'json',
    errorType = 'json',
    ...otherFetchOptions
  } = fetchOptions;

  try {
    const response = yield call(
      fetch,
      authRequest(url, {
        headers: responseType === 'json' ? jsonHeaders : {},
        ...otherFetchOptions,
      })
    );

    if (!response.ok) {
      let error;
      try {
        error = yield response[errorType]();
      } catch (e) {
        error = response.status;
      }

      const getErrorText =
        errorType === 'json' && error.error
          ? (json: { error: { message: string } }) => json.error.message
          : (text: string) => text;
      const e = new Error(getErrorText(error));
      // @ts-ignore
      e.status = response.status;
      throw e;
    }

    const payload = yield response[responseType]();

    yield put({
      ...action,
      type: asyncAction.SUCCESS,
      payload,
    });
  } catch (e) {
    yield put({
      type: asyncAction.ERROR,
      payload: e.message,
      error: true,
      meta: {
        ...action.meta,
        status: e.status,
      },
    });
  }
}

function* loadAllDatas() {
  yield takeEvery(
    // @ts-ignore TODO: fix noImplicitAny error here
    a =>
      a.meta &&
      a.meta.asyncAction &&
      a.type === a.meta.asyncAction.REQUEST &&
      !a.meta.isCached &&
      !a.meta.takeLatest,
    loadData
  );
}

export function* fetchLatestActionSaga() {
  yield takeLatest(
    // @ts-ignore TODO: fix noImplicitAny error here
    a =>
      a.meta &&
      a.meta.asyncAction &&
      a.type === a.meta.asyncAction.REQUEST &&
      !a.meta.isCached &&
      a.meta.takeLatest,
    loadData
  );
}

export default loadAllDatas;
