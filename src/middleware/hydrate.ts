import { get } from 'lodash-es';

import initialState from 'src/initial-state';
import loadGlobal from 'src/redux/global/actions/load-global';
import { getStateFromKey, urlWithState } from 'src/utils/state-key';

// @ts-ignore TODO: fix noImplicitAny error here
function deleteFromState(location) {
  if (!location) {
    return;
  }
  const parts = location.split('.');
  const position = parts.pop();
  const parentLocation = parts.join('.');
  const pathToDelete = parentLocation
    ? get(initialState, parentLocation)
    : initialState;

  delete pathToDelete[position];
}

// @ts-ignore TODO: fix noImplicitAny error here
export const getHydrateAction = (action, stateKey) => {
  const { asyncAction } = action.meta;

  const domPayload = getStateFromKey(initialState, stateKey);
  const domState = domPayload.data;
  if (!domState) {
    return null;
  }

  deleteFromState(domPayload.location);
  return {
    ...action,
    type: asyncAction.SUCCESS,
    payload: domState,
  };
};

// @ts-ignore TODO: fix noImplicitAny error here
const getGlobalAction = (_action, payload) => {
  if (!payload.global) {
    return null;
  }

  const global = loadGlobal();
  return {
    ...global,
    type: global.meta.asyncAction.SUCCESS,
    payload: payload.global,
  };
};

// All destructured elements are unused.
// @ts-ignore
export default () => ({
  // @ts-ignore TODO: fix noImplicitAny error here
  dispatch: _dispatch,
  // @ts-ignore TODO: fix noImplicitAny error here
  getState: _getState,
  // @ts-ignore TODO: fix noImplicitAny error here
}) => next => action => {
  if (!action.meta) {
    return next(action);
  }

  const { stateKey, asyncAction } = action.meta;

  // Only handle async actions with a stateKey
  if (!stateKey || !asyncAction) {
    return next(action);
  }

  if (action.type === asyncAction.REQUEST && !action.meta.isRouterResource) {
    const hydrateAction = getHydrateAction(action, stateKey);
    // If we have hydrated data, exit early with that action
    if (hydrateAction) {
      return next(hydrateAction);
    }

    // We are requesting data with a state key, add the proper `state` query
    // parameter to the request
    action.meta.url = urlWithState(action.meta.url, stateKey);

    return next(action);
  }

  if (action.type === asyncAction.SUCCESS) {
    const { payload = {} } = action;

    const globalAction = getGlobalAction(action, payload);
    if (globalAction) {
      // If there is global data, dispatch the global action
      // (Don't return here, we want to dispatch 2 actions)
      next(globalAction);
    }

    // Extract the payload from the stateKey, if it exists.
    // We only expect data to be structured like that for `?state=section`
    // requests; in other cases we just pass the entire payload through
    const nextPayload = getStateFromKey(payload, stateKey).data || payload;
    return next({
      ...action,
      payload: nextPayload,
    });
  }

  return next(action);
};
