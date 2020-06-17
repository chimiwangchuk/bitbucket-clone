import { put, select } from 'redux-saga/effects';
import { parse, stringify } from 'qs';

import { reloadBranches, getBranchListReloadUrl } from '..';

export default function* reloadBranchesSaga() {
  const fullUrl = yield select(getBranchListReloadUrl);
  const [url, query] = fullUrl.split('?');
  const params = parse(query);
  const nextQuery = stringify(
    {
      ...params,
      cacheBust: Date.now(),
    },
    { skipNulls: true }
  );
  yield put(reloadBranches(`${url}?${nextQuery}`));
}
