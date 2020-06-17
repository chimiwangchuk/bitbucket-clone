import { applyMiddleware, compose, createStore } from 'redux';

import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
// @ts-ignore this package has no typings
import withReduxEnhancer from 'addon-redux/enhancer';

import { getReduxStoreSsrState } from 'src/utils/ssr-hydration';
import { cacheMiddleware } from 'src/redux/cache';
import rootSaga from 'src/sagas';
import { Store, BucketState, Action } from 'src/types/state';
import * as api from 'src/redux/pull-request/api';
import { SAGAS_CONTEXT_KEY_PR_APIS } from 'src/sagas/helpers';
import hydrateMiddleware from './middleware/hydrate';
import normalizrMiddleware from './middleware/normalizr';
import sentryMiddleware from './middleware/sentry';
import thunkMiddleware from './middleware/thunk';
import reducer from './reducers';

const composeEnhancers =
  // Enabled dev-mode redux devtools with traceability
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        trace: true,
        traceLimit: 200,
        maxAge: 200,
      })
    : compose;

type StoreProps = {
  enableSagas?: boolean;
  enableStories?: boolean;
};

const createBitbucketStore = (
  { enableSagas = true, enableStories = false }: StoreProps = {
    enableSagas: true,
    enableStories: false,
  }
): Store => {
  const middlewares = [
    hydrateMiddleware(),
    normalizrMiddleware(),
    cacheMiddleware(),
    thunkMiddleware(),
  ];

  let sagaMiddleware: SagaMiddleware | undefined;
  if (enableSagas) {
    sagaMiddleware = createSagaMiddleware({
      context: {
        [SAGAS_CONTEXT_KEY_PR_APIS]: api,
      },
    });
    middlewares.push(sagaMiddleware);
  }

  // Put this last to collect the action information in its "final" state
  middlewares.push(sentryMiddleware);

  const enhancers = [applyMiddleware(...middlewares)];

  if (enableStories) {
    enhancers.push(withReduxEnhancer);
  }

  const store: Store = createStore<BucketState, Action, any, any>(
    reducer,
    getReduxStoreSsrState(),
    composeEnhancers(...enhancers)
  );

  if (enableSagas && sagaMiddleware) {
    sagaMiddleware.run(rootSaga);
  }

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line
    const ReselectTools = require('reselect-tools');
    ReselectTools.getStateWith(() => store.getState());
    // this is kinda gross but only happens in dev, install the Reselect Devtools Extension!
    ReselectTools.registerSelectors({
      ...require('src/selectors/conversation-selectors'),
      ...require('src/selectors/feature-selectors'),
      ...require('src/selectors/file-tree-selectors'),
      ...require('src/selectors/form-selectors'),
      ...require('src/selectors/global-selectors'),
      ...require('src/selectors/repository-selectors'),
      ...require('src/selectors/workspace-selectors'),
      ...require('src/selectors/search-selectors'),
      ...require('src/selectors/state-slicing-selectors'),
      ...require('src/selectors/task-selectors'),
      ...require('src/selectors/user-selectors'),
      ...require('src/redux/pull-request/selectors/activity-selectors'),
      ...require('src/redux/pull-request/selectors/index'),
      ...require('src/redux/branches/selectors'),
      ...require('src/redux/commit-list/selectors'),
      ...require('src/redux/create-branch/selectors'),
      ...require('src/redux/dashboard/selectors/pull-requests'),
      ...require('src/redux/dashboard/selectors/repositories'),
      ...require('src/redux/dashboard/selectors/section'),
      ...require('src/redux/pr-commits/selectors'),
      ...require('src/redux/profile/selectors'),
      ...require('src/redux/pull-request-list/selectors'),
      ...require('src/redux/search/selectors'),
    });
  }
  return store;
};

export default createBitbucketStore;

export const bitbucketStore = createBitbucketStore();
