import { put, delay } from 'redux-saga/effects';

import { SET_APPROVAL_LOADER } from 'src/redux/pull-request/actions';

function* approvalLoadingSaga() {
  yield delay(1000);
  yield put({ type: SET_APPROVAL_LOADER });
}

export default approvalLoadingSaga;
