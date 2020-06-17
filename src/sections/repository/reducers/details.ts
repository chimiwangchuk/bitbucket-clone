import { Repository } from 'src/components/types';

import createReducer from 'src/utils/create-reducer';

import {
  FetchRepositoryDetails,
  FetchRepositoryMainBranch,
  TOGGLE_REPOSITORY_WATCH,
} from '../actions';
import { GroupAccess, RepositoryPrivilege } from '../types';

export type SourceRepositoryDetailsState = {
  accessLevel?: RepositoryPrivilege;
};

export const initialStateSourceRepository: SourceRepositoryDetailsState = {
  accessLevel: undefined,
};

export type RepositoryDetailsState = {
  accessLevel?: RepositoryPrivilege;
  branchCount?: number;
  commitsBehindParent?: number;
  directAccess?: boolean;
  forkCount?: number;
  groupAccess?: GroupAccess;
  hasError: boolean;
  isLoading?: boolean;
  language?: string;
  lastUpdated?: string;
  openPullRequestCount?: number;
  parent?: Repository;
  isReadOnly?: boolean;
  isWatching?: boolean;
  size?: number;
  watcherCount?: number;
  mainBranch?: any;
  developmentBranch?: any;
  productionBranch?: any;
};

const initialState: RepositoryDetailsState = {
  hasError: false,
  isLoading: false,
  isWatching: false,
};

export default createReducer(initialState, {
  [FetchRepositoryDetails.REQUEST](state) {
    return {
      ...state,
      hasError: false,
      isLoading: true,
    };
  },

  [FetchRepositoryDetails.SUCCESS](state, action) {
    const { result } = action.payload;
    const details = {
      accessLevel: result.access_level,
      branchCount: result.branches,
      commitsBehindParent: result.commits_behind_parent,
      directAccess: result.direct_access,
      forkCount: result.forks,
      groupAccess: result.group_access,
      lastUpdated: result.last_updated,
      language: result.language ? result.language.label : undefined,
      openPullRequestCount: result.pullrequests.open,
      parent: result.parent,
      isReadOnly: result.read_only,
      isWatching: result.is_watching,
      size: result.size,
      watcherCount: result.watchers,
    };

    return {
      ...state,
      ...details,
      hasError: false,
      isLoading: false,
    };
  },

  [FetchRepositoryDetails.ERROR](state) {
    return {
      ...state,
      hasError: true,
      isLoading: false,
    };
  },

  [FetchRepositoryMainBranch.SUCCESS](state, action) {
    const mainBranch = action.payload;

    return {
      ...state,
      mainBranch,
    };
  },

  [TOGGLE_REPOSITORY_WATCH.SUCCESS](state, action) {
    return {
      ...state,
      ...action.payload,
    };
  },
});
