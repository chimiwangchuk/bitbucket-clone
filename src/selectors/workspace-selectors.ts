import { createSelector, Selector } from 'reselect';
import { BucketState } from 'src/types/state';
import { getRecentlyViewedWorkspacesKeys as getRecentlyViewedWorkspaces } from 'src/selectors/state-slicing-selectors';

export const getRecentlyViewedWorkspacesKeys: Selector<
  BucketState,
  string[] | undefined
> = createSelector(
  getRecentlyViewedWorkspaces,
  recentlyWorkspacesKeys => recentlyWorkspacesKeys
);
