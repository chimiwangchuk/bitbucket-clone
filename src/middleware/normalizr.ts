import { normalize } from 'normalizr';

// All destructured elements are unused.
// @ts-ignore
export default () => ({
  // @ts-ignore TODO: fix noImplicitAny error here
  dispatch: _dispatch,
  // @ts-ignore TODO: fix noImplicitAny error here
  getState: _getState,
  // @ts-ignore TODO: fix noImplicitAny error here
}) => next => action => {
  const schema = action.meta && action.meta.schema;

  if (schema && action.payload && !action.error) {
    return next({
      ...action,
      payload: normalize(action.payload, schema),
    });
  }

  return next(action);
};
