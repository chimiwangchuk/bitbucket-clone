import { get } from 'lodash-es';
import { takeLatest, put, call, select } from 'redux-saga/effects';
import { LoadAnnotations } from '../actions';
import { Annotation } from '../types';

// @ts-ignore TODO: fix noImplicitAny error here
const fetchJson = url => fetch(url).then(r => r.json());
const assignAnnotationIds = (annotations: Annotation[], annotatorId: string) =>
  annotations.map((res, i) => ({
    ...res,
    id: i,
    annotatorId,
  }));

function* doLoadAnnotations() {
  const annotators = yield select(state =>
    get(state, 'repository.source.annotations.annotators', '')
  );
  if (!annotators || !annotators.length) {
    // Return success to ensure that isLoading is set to false
    yield put({
      type: LoadAnnotations.SUCCESS,
      payload: [],
    });
    return;
  }

  const annotator = annotators[0];
  const annotations = yield call(fetchJson, annotator.source.url);
  yield put({
    type: LoadAnnotations.SUCCESS,
    payload: assignAnnotationIds(annotations, annotator.id),
  });
}

export default function* loadAnnotations() {
  yield takeLatest(LoadAnnotations.REQUEST, doLoadAnnotations);
}
