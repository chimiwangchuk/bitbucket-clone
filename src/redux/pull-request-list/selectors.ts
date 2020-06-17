import { denormalize } from 'normalizr';
import { createSelector, Selector } from 'reselect';
import { get, memoize } from 'lodash-es';

import { pullRequest } from 'src/redux/pull-request/schemas';
import {
  getRepository,
  getEntities,
} from 'src/selectors/state-slicing-selectors';
import displayNameWithNickname from 'src/utils/display-name-with-nickname';
import { getPagination } from 'src/utils/get-pagination';
import { BucketState } from 'src/types/state';
import { getCurrentUser } from 'src/selectors/user-selectors';
import { User } from 'src/components/types';
import { AuthorOption } from 'src/sections/repository/sections/pull-request-list/types';

export const getPullRequestList = createSelector(
  getRepository,
  repository => repository.pullRequestList.pullRequests
);

export const getPullRequests = createSelector(
  getPullRequestList,
  getEntities,
  (prList, entities) => denormalize(prList.listItems, [pullRequest], entities)
);

export const getPullRequestAuthorsSlice = (state: BucketState) => {
  return state.repository.pullRequestList.pullRequestAuthors;
};

export const getPullRequestPreloadedAuthorSlice = (state: BucketState) => {
  return state.repository.pullRequestList.pullRequestPreloadedAuthor;
};

const makeOption = (user: User): AuthorOption => ({
  label: displayNameWithNickname(user.display_name, user.nickname),
  value: user,
});

const prependCurrentUserToAuthors = (
  currentUser: User | null | undefined,
  authors: User[]
) => {
  if (!currentUser) {
    return authors;
  }
  return [currentUser, ...authors.filter(a => a.uuid !== currentUser.uuid)];
};

export const getPullRequestAuthorOptions: Selector<
  BucketState,
  any
> = createSelector(
  getPullRequestAuthorsSlice,
  getCurrentUser,
  ({ authors, filteredAuthors }, currentUser) => {
    const authorsToUse = filteredAuthors.length ? filteredAuthors : authors;
    const reorderedAuthors = prependCurrentUserToAuthors(
      currentUser,
      authorsToUse
    );
    return reorderedAuthors.map(author => makeOption(author));
  }
);

export const getPullRequestPreloadedAuthorOption = (uuid?: string) =>
  createSelector(
    getPullRequestAuthorOptions,
    getPullRequestPreloadedAuthorSlice,
    (options, { author: preloadedAuthor }) => {
      if (!uuid) {
        return null;
      }
      if (preloadedAuthor && preloadedAuthor.uuid === uuid) {
        return makeOption(preloadedAuthor);
      }
      // @ts-ignore TODO: fix noImplicitAny error here
      return options.find(option => get(option, 'value.uuid') === uuid);
    }
  );

const getPullRequestListSize = (state: BucketState) =>
  state.repository.pullRequestList.pullRequests.size;

const getPullRequestListLength = (state: BucketState) =>
  state.repository.pullRequestList.pullRequests.pagelen;

export const getPullRequestTotalPages = createSelector(
  getPullRequestListSize,
  getPullRequestListLength,
  (size, pageLength) => (size && pageLength ? Math.ceil(size / pageLength) : 1)
);

// Using lodash memoize method because we get dynamic argument into our calculation function
// and we want to reduce redundant selector recalculation calls to minimum needed
export const getPullRequestsPagination = createSelector(
  getPullRequestTotalPages,
  totalPages => memoize(getPagination(totalPages))
);
