import { createAsyncAction } from 'src/redux/actions';
import { SearchQueryParams } from 'src/types/search';

export const FetchSearchResults = createAsyncAction(
  'search/FETCH_SEARCH_RESULTS'
);

export default (searchParams: SearchQueryParams) => ({
  type: FetchSearchResults.REQUEST,
  payload: {
    ...searchParams,
  },
});
