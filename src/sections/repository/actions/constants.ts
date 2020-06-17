import { createAsyncAction } from 'src/redux/actions';

export const FetchRepositoryDetails = createAsyncAction(
  'repository/FETCH_REPOSITORY_DETAILS'
);
export const FetchSourceRepositoryDetails = createAsyncAction(
  'repository/FETCH_SOURCE_REPOSITORY_DETAILS'
);
export const FetchRepositorySubscriptions = createAsyncAction(
  'repository/FETCH_REPOSITORY_SUBSCRIPTIONS'
);
export const FetchRepositoryMainBranch = createAsyncAction(
  'repository/FETCH_REPOSITORY_MAIN_BRANCH'
);

export const LoadRepositoryPage = createAsyncAction(
  'repository/LOAD_REPOSITORY_PAGE'
);
export const TOGGLE_CLONE_DIALOG = 'repository/TOGGLE_CLONE_DIALOG';
export const TOGGLE_REPOSITORY_WATCH = createAsyncAction(
  'source/TOGGLE_REPOSITORY_WATCH'
);
export const TOGGLE_SUBSCRIPTIONS_DIALOG =
  'repository/TOGGLE_SUBSCRIPTIONS_DIALOG';
export const TOGGLE_SYNC_DIALOG = 'repository/TOGGLE_SYNC_DIALOG';
export const UNLOAD_REPOSITORY = 'repository/UNLOAD_REPOSITORY';
export const UPDATE_MENU_ITEMS = 'repository/UPDATE_MENU_ITEMS';
export const UPDATE_MENU_ITEM_URLS_REPO_NAME =
  'repository/UPDATE_MENU_ITEM_URLS_REPO_NAME';
export const UPDATE_REPOSITORY_SECTION_MENU_ITEMS =
  'repository/UPDATE_REPOSITORY_SECTION_MENU_ITEMS';
export const UPDATE_REPOSITORY_ENTITY = 'repository/UPDATE_REPOSITORY_ENTITY';

export const FetchUserEmails = createAsyncAction('FETCH_USER_EMAILS');
