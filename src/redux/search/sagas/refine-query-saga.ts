import { call, put, select } from 'redux-saga/effects';
import { change } from 'redux-form';
import { FORM_KEY } from 'src/constants/search';
import { publishFact } from 'src/utils/analytics/publish';
import { SearchFormRefineMenuItemAddedFact } from 'src/sections/search/facts';

type RefineQueryAction = {
  type: string;
  payload: {
    item: { modifier?: string; operator?: string };
  };
};

export default function* refineQuerySaga({
  payload: { item },
}: RefineQueryAction) {
  const state = yield select();
  const { values } = state.form[FORM_KEY];
  const { query } = values;
  let refinedQuery;

  if (query && item.modifier) {
    refinedQuery = `${values.query} ${item.modifier}:`;
  } else if (item.modifier) {
    refinedQuery = `${item.modifier}:`;
  }

  yield call(
    publishFact,
    new SearchFormRefineMenuItemAddedFact({
      modifier: item.modifier ? item.modifier : undefined,
    })
  );

  yield put(change(FORM_KEY, 'query', refinedQuery));
}
