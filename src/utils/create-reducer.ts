import { Action } from '../types/state';

type Reducer<T> = (state: T, action: Action) => T;

const createReducer = <T>(
  initialState: T,
  handlers: { [key: string]: Reducer<T> }
) => (state: T = initialState, action: Action): T => {
  if (handlers[action.type]) {
    return handlers[action.type](state, action);
  }
  return state;
};

export default createReducer;
