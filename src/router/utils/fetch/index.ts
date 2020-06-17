import { jsonHeaders, getRequestHeaders } from '../../../utils/fetch';
import { FetchAction } from '../../../redux/actions';
import { Thunk } from '../../../types/state';

export const fetchData = (action: FetchAction): Thunk => {
  return async dispatch => {
    // taken from fetch-action-saga
    const { url, asyncAction, csrftoken, fetchOptions = {} } = action.meta;
    const {
      responseType = 'json',
      errorType = 'json',

      ...otherFetchOptions
    } = fetchOptions;

    let payload;

    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
        ...otherFetchOptions,
        headers: {
          ...(responseType === 'json' ? jsonHeaders : {}),
          ...getRequestHeaders(url, csrftoken),
          ...(otherFetchOptions.headers || {}),
        },
      });

      if (!response.ok) {
        const error = await response[errorType]();
        const getErrorText =
          // @ts-ignore TODO: fix noImplicitAny error here
          errorType === 'json' ? json => json.error.message : text => text;
        const e = new Error(getErrorText(error));
        // @ts-ignore
        e.status = response.status;

        throw e;
      }

      payload = await response[responseType]();
    } catch (error) {
      // TODO - when we do SSR we need to check that errors are correctly hydrated
      return dispatch({
        type: asyncAction.ERROR,
        payload: error,
        error: true,
        meta: {
          ...action.meta,
          status: error.status,
        },
      });
    }

    return dispatch({
      ...action,
      type: asyncAction.SUCCESS,
      payload,
    });
  };
};
