import { createAsyncAction, hydrateAction } from 'src/redux/actions';
import { user } from 'src/sections/profile/schemas';
import urls from 'src/urls/search';

export const LoadSearchPage = createAsyncAction('search/LOAD_PAGE');

export default (accountUuid?: string) =>
  hydrateAction(LoadSearchPage, 'search', {
    url: urls.ui.search({ accountUuid }),
    schema: {
      accounts: [user],
    },
  });
