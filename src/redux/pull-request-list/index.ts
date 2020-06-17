import { combineReducers } from 'redux';

import pullRequests from './reducers/pull-request-list';
import pullRequestAuthors from './reducers/pull-request-authors';
import pullRequestPreloadedAuthor from './reducers/pull-request-preloaded-author';

export * from './actions';
export * from './selectors';
export * from './types';

export default combineReducers({
  pullRequests,
  pullRequestAuthors,
  pullRequestPreloadedAuthor,
});
