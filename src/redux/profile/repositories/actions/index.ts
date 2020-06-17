import { createAsyncAction } from 'src/redux/actions';

export const FetchProfileRepositories = createAsyncAction(
  'profile-repositories/FETCH_PROFILE_REPOSITORIES'
);

export const FetchProfileRepositoriesLanguages = createAsyncAction(
  'profile-repositories/FETCH_PROFILE_REPOSITORIES_LANGUAGES'
);
export const PageUnload = `profile-repositories/PAGE_UNLOAD`;
export const pageUnload = () => ({ type: PageUnload });
