import { eventChannel } from 'redux-saga';
import { put, take } from 'redux-saga/effects';

import { PageHidden, PageVisible } from '../actions/page-visibility';

function createVisibilityChannel() {
  return eventChannel(emit => {
    const change = () => {
      emit(document.hidden);
    };
    document.addEventListener('visibilitychange', change);
    return () => {
      document.removeEventListener('visibilitychange', change);
    };
  });
}

// Dispatches either a "page hidden" or "visible" action when the document visibility changes
export default function* pageVisibilitySaga() {
  const channel = createVisibilityChannel();
  while (true) {
    const action = (yield take(channel)) ? PageHidden() : PageVisible();
    yield put(action);
  }
}
