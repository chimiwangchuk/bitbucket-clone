// @ts-ignore TODO: fix noImplicitAny error here
export default () => ({ dispatch, getState }) => next => action => {
  if (typeof action === 'function') {
    return action(dispatch, getState);
  }
  return next(action);
};
