import {
  UNLOAD_PULL_REQUEST,
  LOAD_PULL_REQUEST,
} from '../pull-request/actions';
import Actions from './actions';

export type PRCommitStateShape = {
  isLoading: boolean;
  hasError: boolean;
  // commits are normalized data
  commits: string[] | undefined;
  nextCommitsUrl: string | undefined;
};

const initialState: PRCommitStateShape = {
  isLoading: true,
  hasError: false,
  commits: undefined,
  nextCommitsUrl: undefined,
};

export default (
  state: PRCommitStateShape = initialState,
  // @ts-ignore TODO: fix noImplicitAny error here
  action
): PRCommitStateShape => {
  switch (action.type) {
    case LOAD_PULL_REQUEST.SUCCESS: {
      const { result } = action.payload;
      // If we're NOT using commits api then the LOAD_PULL_REQUEST will have commits for us
      if (result.commits) {
        return {
          commits: result.commits,
          isLoading: false,
          hasError: false,
          nextCommitsUrl: undefined,
        };
      }
      return state;
    }
    case UNLOAD_PULL_REQUEST:
      return initialState;
    case Actions.UPDATE_COMMITS: {
      const { commits, page, next } = action.payload.result;

      return {
        ...state,
        commits: page === 1 ? commits : [...state.commits, ...commits],
        isLoading: false,
        hasError: false,
        nextCommitsUrl: next,
      };
    }
    case Actions.COMMIT_FETCH_ERROR:
      return {
        ...state,
        hasError: true,
        isLoading: false,
        nextCommitsUrl: undefined,
      };
    case Actions.RETRY_COMMITS:
      return {
        ...state,
        hasError: false,
        isLoading: true,
        nextCommitsUrl: undefined,
      };
    case Actions.FETCH_MORE_COMMITS:
      return { ...state, hasError: false, isLoading: true };
    default:
      return state;
  }
};
