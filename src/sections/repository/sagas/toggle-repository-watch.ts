import { call, put, take } from 'redux-saga/effects';

import { showFlag } from 'src/redux/flags';
import authRequest from 'src/utils/fetch';

import urls from '../urls';
import { TOGGLE_REPOSITORY_WATCH } from '../actions/index';
import messages from './toggle-repository-watch.i18n';

export default function* toggleRepositoryWatchSaga() {
  while (true) {
    const action = yield take(TOGGLE_REPOSITORY_WATCH.REQUEST);

    const { repositoryFullSlug } = action.payload;
    const endpoint = urls.api.internal.toggleWatch(repositoryFullSlug);

    try {
      const request = authRequest(endpoint, { method: 'POST' });
      const response = yield call(fetch, request);

      if (!response.ok) {
        throw Error(response.statusText);
      }

      const json = yield response.json();
      const watchMessage = json.following
        ? messages.watchedRepository
        : messages.unwatchedRepository;

      yield put({
        type: TOGGLE_REPOSITORY_WATCH.SUCCESS,
        payload: { isWatching: json.following, watcherCount: json.followers },
      });
      yield put(
        showFlag({
          id: `${json.following ? 'watch' : 'unwatch'}-success`,
          iconType: 'success',
          title: { msg: watchMessage },
          autoDismiss: true,
        })
      );
    } catch (e) {
      yield put({
        type: TOGGLE_REPOSITORY_WATCH.ERROR,
        payload: e.message,
      });
      yield put(
        showFlag({
          id: 'watch-error',
          iconType: 'error',
          title: 'Something went wrong!',
          description: e.message,
        })
      );
    }
  }
}
