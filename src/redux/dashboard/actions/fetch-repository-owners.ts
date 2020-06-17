import urls from 'src/urls/dashboard';
import profileUrls from 'src/urls/profile';

import { fetchAction, createAsyncAction } from 'src/redux/actions';
import { Owner } from 'src/sections/dashboard/types';

export const FetchOwners = createAsyncAction('dashboard/FETCH_OWNERS');

export const fetchOwners = (query: string) => {
  return fetchAction(FetchOwners, {
    url: urls.api.internal.repositoryOwners(query),
  });
};

export const FetchAndSelectOwner = createAsyncAction(
  'dashboard/FETCH_AND_SELECT_OWNER'
);

export const fetchAndSelectOwner = (uuid: string) => {
  return fetchAction(FetchAndSelectOwner, {
    url: profileUrls.api.v20.user(uuid),
  });
};

export const CLEAR_FILTERED_OWNERS = `dashboard/CLEAR_FILTERED_OWNERS`;
export const clearFilteredOwners = () => ({ type: CLEAR_FILTERED_OWNERS });

export const SELECT_OWNER = `dashboard/SELECT_OWNER`;
export const selectOwner = (owner: Owner | null) => ({
  type: SELECT_OWNER,
  payload: owner,
});
