import { SearchQueryParams } from 'src/types/search';

export const RESET_SEARCH = 'search/RESET_SEARCH';
export const SYNC_URL_TO_STATE = 'search/SYNC_URL_TO_STATE';

export default (params: SearchQueryParams) => {
  return {
    type: SYNC_URL_TO_STATE,
    payload: {
      params,
    },
  };
};
