import { denormalize } from 'normalizr';
import { User } from 'src/components/types';

import { user as userSchema } from 'src/sections/profile/schemas';
import { BucketState } from 'src/types/state';

import { SearchQueryParams } from 'src/types/search';

export const getSearchAccount = (
  state: BucketState,
  params: SearchQueryParams
): User | null | undefined => {
  const { entities } = state;
  const { account } = denormalize(
    {
      account: params.account,
    },
    {
      account: userSchema,
    },
    entities
  );
  return account;
};
