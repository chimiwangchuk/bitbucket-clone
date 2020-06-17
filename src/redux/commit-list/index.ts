import { stringify } from 'qs';
import { Commit } from 'src/components/types';

import { createAsyncAction, fetchAction } from 'src/redux/actions';
import urls from 'src/urls/commit';

import { dismissFlag } from 'src/redux/flags';

// Action Types

const prefixed = (action: string) => `commitList/${action}`;

export const LoadCommits = createAsyncAction(prefixed('LOAD'));
export const UPDATE_COMMITS = prefixed('UPDATE');
export const UPDATE_CURRENT_PAGE = prefixed('UPDATE_CURRENT_PAGE');
export const UPDATE_START_PAGE = prefixed('UPDATE_START_PAGE');
export const PAGE_UNLOAD = prefixed('PAGE_UNLOAD');

// Action Creators

type LoadCommitsOptions = {
  ctx?: string;
  page?: string | number;
  pageLength?: number;
  refName?: string;
  isFiltering?: boolean;
  repositoryFullSlug: string;
  search: string;
};

export const loadCommits = (options: LoadCommitsOptions) => {
  const query = stringify({
    fields: '+*.participants.approved,-*.participants.*',
    include: options.refName || undefined,
    ctx: options.ctx || undefined,
    page: options.page || undefined,
    pagelen: options.pageLength || undefined,
    search: options.search || undefined,
  });

  const url = `${urls.api.internal.commits(
    options.repositoryFullSlug
  )}?${query}`;

  return fetchAction(LoadCommits, {
    url,
    data: { isFiltering: options.isFiltering },
    cache: {
      key: `${url}-${options.isFiltering}`,
      ttl: 15,
    },
  });
};

export const updateCurrentPage = (page: number) => {
  return {
    type: UPDATE_CURRENT_PAGE,
    payload: page,
  };
};

export const updateStartPage = (page: number) => {
  return {
    type: UPDATE_START_PAGE,
    payload: page,
  };
};

export const pageUnload = () => ({ type: PAGE_UNLOAD });

export const ShowNewCommits = 'commits/ShowNewCommits';
// @ts-ignore TODO: fix noImplicitAny error here
export const showNewCommits = () => dispatch => {
  const showNewCommitsAction = { type: ShowNewCommits };
  const dismissFlagAction = dismissFlag('commits-list-updated');

  dispatch(showNewCommitsAction);
  dispatch(dismissFlagAction);
};

// Selectors

export * from './selectors';

// Reducer
export interface PaginationUrls {
  [key: string]: {
    previousUrl: string | undefined;
    nextUrl: string | undefined;
  };
}

export type CommitListState = {
  commits: Commit[];
  currentPage: number;
  hasNextPage: boolean;
  isLoading: boolean;
  isFiltering: boolean;
  isPreRequestState: boolean;
  pageLength: number;
  startPage: number;
  reloadUrl: string | null;
  newCommits: Commit[];
  newCommitsHasNextPage: boolean;
  paginationUrls: PaginationUrls | {};
};

const initialState = {
  commits: [],
  currentPage: 1,
  hasNextPage: false,
  isLoading: false,
  isFiltering: false,
  isPreRequestState: true,
  pageLength: 25,
  startPage: 1,
  reloadUrl: null,
  newCommits: [],
  newCommitsHasNextPage: false,
  paginationUrls: {},
};

export const reducer = (
  state: CommitListState = initialState,
  action: any
): CommitListState => {
  switch (action.type) {
    case LoadCommits.REQUEST: {
      const { isFiltering = false } = action.meta ? action.meta.data : {};
      const reloadUrl = action.meta && action.meta.url ? action.meta.url : null;

      return {
        ...state,
        isLoading: true,
        isPreRequestState: false,
        reloadUrl,
        isFiltering,
      };
    }

    case LoadCommits.ERROR: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case LoadCommits.SUCCESS: {
      const { isFiltering = false } = action.meta ? action.meta.data : {};
      const { next, previous, values } = action.payload;
      const {
        startPage,
        currentPage,
        commits,
        pageLength,
        hasNextPage,
      } = state;

      // When commit list is being filtered by branch change, etc.
      // we should make sure that some values like commits, currentPage
      // should be rollback to their initial state
      const commitsAfterFilter = isFiltering ? [] : commits;
      const pagesLoaded = Math.ceil(
        (commitsAfterFilter.length + values.length) / pageLength
      );
      const endPage = startPage + pagesLoaded - 1;
      const updateCommits =
        currentPage < startPage
          ? [...values, ...commitsAfterFilter]
          : [...commitsAfterFilter, ...values];
      const updatedStartPage =
        currentPage < startPage ? currentPage : startPage;
      const updatedCurrentPage = isFiltering ? 1 : currentPage;

      return {
        ...state,
        hasNextPage: updatedCurrentPage === endPage ? !!next : hasNextPage,
        isLoading: false,
        isFiltering: false,
        startPage: isFiltering ? 1 : updatedStartPage,
        commits: updateCommits,
        currentPage: updatedCurrentPage,
        paginationUrls: {
          ...state.paginationUrls,
          [currentPage]: {
            previousUrl: previous,
            nextUrl: next,
          },
        },
      };
    }

    case UPDATE_COMMITS: {
      const { commits } = state;

      return {
        ...state,
        commits: commits.map(commit => {
          const updatedCommit = action.payload.find(
            // @ts-ignore TODO: fix noImplicitAny error here
            ({ hash }) => hash === commit.hash
          );

          return updatedCommit || commit;
        }),
      };
    }

    case UPDATE_CURRENT_PAGE: {
      return {
        ...state,
        currentPage: action.payload,
      };
    }

    case UPDATE_START_PAGE: {
      return {
        ...state,
        startPage: action.payload,
      };
    }

    case ShowNewCommits: {
      return {
        ...state,
        commits: [...state.newCommits],
        hasNextPage: state.newCommitsHasNextPage,
        newCommits: [],
        newCommitsHasNextPage: false,
      };
    }

    case PAGE_UNLOAD: {
      return initialState;
    }

    default:
      return state;
  }
};
