import { put, select, call } from 'redux-saga/effects';
import { getCurrentPullRequestUrlPieces } from 'src/redux/pull-request/selectors';
import fetchAccessToken from 'src/utils/fetch-access-token';
import { BbEnv, getBbEnv } from 'src/utils/bb-env';
import { getIsPrAnnotationsEnabled } from 'src/selectors/feature-selectors';
import { getGlobalIsAnnotationsEnabled } from 'src/redux/pull-request-settings';
import { CODE_INSIGHTS_ANNOTATIONS_PAGE_SIZE } from 'src/sections/repository/constants';
import { FETCH_PULL_REQUEST_ANNOTATIONS } from '../actions';
import { fetchAllPagesWithAccessToken } from './utils/fetch-with-access-token';
// Unfortunately the usual `/!api/internal` URL format doesn't work with Pipelines URLs
// due to https://softwareteams.atlassian.net/browse/BECO-211
const bbEnv = getBbEnv();
const baseUrl =
  bbEnv === BbEnv.Staging
    ? 'https://api-staging.bb-inf.net/internal/pipelines/stg-west/internal'
    : 'https://api.bitbucket.org/internal';

export function* fetchAnnotationsWithAccessToken(accessToken: {
  token: string;
}) {
  const { owner, slug, id } = yield select(getCurrentPullRequestUrlPieces);
  const url = `${baseUrl}/repositories/${owner}/${slug}/pullrequests/${id}/annotations?page=1`;

  try {
    const annotations = yield call(
      fetchAllPagesWithAccessToken,
      url,
      accessToken,
      CODE_INSIGHTS_ANNOTATIONS_PAGE_SIZE
    );
    yield put({
      type: FETCH_PULL_REQUEST_ANNOTATIONS.SUCCESS,
      payload: annotations || [],
    });
  } catch (e) {
    yield put({
      type: FETCH_PULL_REQUEST_ANNOTATIONS.ERROR,
      payload: e.message,
    });
  }
}

export function* fetchPullRequestAnnotations() {
  const isAnnotationsUserPrefsEnabled = yield select(
    getGlobalIsAnnotationsEnabled
  );
  const isPrAnnotationsEnabled = yield select(getIsPrAnnotationsEnabled);
  if (!isAnnotationsUserPrefsEnabled || !isPrAnnotationsEnabled) {
    return;
  }
  try {
    const accessToken = yield call(fetchAccessToken, 'site:JSAPITOKEN');
    yield call(fetchAnnotationsWithAccessToken, accessToken);
  } catch (e) {
    yield put({
      type: FETCH_PULL_REQUEST_ANNOTATIONS.ERROR,
      payload: e.message,
    });
  }
}
