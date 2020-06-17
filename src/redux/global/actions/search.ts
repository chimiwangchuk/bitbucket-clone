import { SEARCH } from './';

export type SearchAction = {
  type: 'global/SEARCH';
  payload: string;
};

export default (query: string): SearchAction => ({
  type: SEARCH,
  payload: query,
});
