import { denormalize } from 'normalizr';
import { createSelector, Selector } from 'reselect';
import { FeatureFlagUser, Identifiers } from '@atlassian/bitbucket-features';
import { User } from 'src/components/types';

import { user as userSchema } from 'src/sections/profile/schemas';
import { GlobalState } from 'src/redux/global/reducer';
import { BucketState } from 'src/types/state';

import { getEntities, getGlobal } from './state-slicing-selectors';

export const getCurrentUserKey: Selector<
  BucketState,
  string | null | undefined
> = createSelector(getGlobal, (state: GlobalState) => state.currentUser);

export const getTargetUserKey: Selector<
  BucketState,
  string | null | undefined
> = createSelector(getGlobal, (state: GlobalState) => state.targetUser);

export const getCurrentUser: Selector<
  BucketState,
  User | null | undefined
> = createSelector(getCurrentUserKey, getEntities, (key, entities) =>
  denormalize(key, userSchema, entities)
);

export const getTargetUser: Selector<
  BucketState,
  User | null | undefined
> = createSelector(getTargetUserKey, getEntities, (key, entities) =>
  denormalize(key, userSchema, entities)
);

export const getCurrentUserDefaultCloneProtocol: Selector<
  BucketState,
  string
> = createSelector(getCurrentUser, (user: User | null | undefined) =>
  user && user.extra && user.extra.has_ssh_key ? 'ssh' : 'https'
);

export const getCurrentUserIsAnonymous: Selector<
  BucketState,
  boolean
> = createSelector(getGlobal, (state: GlobalState) => !state.currentUser);

const getCurrentUserAccountId = createSelector(
  getCurrentUser,
  user => user?.account_id
);

export const getCurrentFeatureFlagUser: Selector<
  BucketState,
  FeatureFlagUser
> = createSelector(getCurrentUserAccountId, accountId => {
  if (accountId) {
    return {
      identifier: {
        type: Identifiers.ATLASSIAN_ACCOUNT_ID,
        value: accountId,
      },
      isAnonymous: false,
    };
  }
  return { isAnonymous: true };
});
