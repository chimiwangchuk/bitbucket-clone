import { createSelector, Selector } from 'reselect';
import { denormalize } from 'normalizr';
import { commit as commitSchema } from 'src/redux/pull-request/schemas';
import { BucketState } from 'src/types/state';
import { getEntities } from 'src/selectors/state-slicing-selectors';

const getCommitsKeys = (state: BucketState) => state.prCommits.commits;
export const getCommitsNextUrl = (state: BucketState) =>
  state.prCommits.nextCommitsUrl;
const getCommitsLoading = (state: BucketState) => state.prCommits.isLoading;
const getCommitsError = (state: BucketState) => state.prCommits.hasError;

export const getCurrentPullRequestCommits: Selector<
  BucketState,
  BB.Commit[] | undefined
> = createSelector(getCommitsKeys, getEntities, (keys, entities) =>
  denormalize(keys, [commitSchema], entities)
);

export const getPullRequestCommitsState = createSelector(
  getCurrentPullRequestCommits,
  getCommitsError,
  getCommitsLoading,
  getCommitsNextUrl,
  (commits, hasError, isLoading, nextUrl) => ({
    commits,
    hasError,
    isLoading,
    nextUrl,
  })
);
