import { put, select, call, all, takeLatest } from 'redux-saga/effects';
import {
  getCurrentPullRequestUrlPieces,
  getPullRequestSourceHash,
} from 'src/redux/pull-request/selectors';
import fetchAccessToken from 'src/utils/fetch-access-token';
import { BbEnv, getBbEnv } from 'src/utils/bb-env';
import {
  CODE_INSIGHTS_ANNOTATIONS_PAGE_SIZE,
  CODE_INSIGHTS_REPORTS_PAGE_SIZE,
} from 'src/sections/repository/constants';
import {
  FETCH_CODE_INSIGHTS_REPORTS,
  FETCH_CODE_INSIGHTS_ANNOTATIONS,
  FETCH_IS_PIPELINES_ENABLED,
} from '../actions';
import fetchWithAccessToken, {
  fetchAllPagesWithAccessToken,
} from './utils/fetch-with-access-token';

// Unfortunately the usual `/!api/internal` URL format doesn't work with Pipelines URLs
// due to https://softwareteams.atlassian.net/browse/BECO-211
const bbEnv = getBbEnv();
const baseUrl =
  bbEnv === BbEnv.Staging
    ? 'https://api-staging.bb-inf.net/internal/pipelines/stg-west/internal'
    : 'https://api.bitbucket.org/2.0';
const internalBaseUrl =
  bbEnv === BbEnv.Staging
    ? 'https://api-staging.bb-inf.net/internal/pipelines/stg-west/internal'
    : 'https://api.bitbucket.org/internal';

export function* fetchPipelinesConfig(accessToken: { token: string }) {
  const { owner, slug } = yield select(getCurrentPullRequestUrlPieces);
  const url = `${internalBaseUrl}/repositories/${owner}/${slug}/pipelines_config/capabilities/?fields=repository_config,allowance`;
  try {
    // eslint-disable-next-line @typescript-eslint/camelcase
    const { repository_config, allowance } = yield call(
      fetchWithAccessToken,
      url,
      accessToken,
      false
    );
    yield put({
      type: FETCH_IS_PIPELINES_ENABLED.SUCCESS,
      payload: {
        isPipelinesEnabled: repository_config.pipelines_enabled,
        isPipelinesPremium: allowance.premium,
      },
    });
  } catch (e) {
    yield put({ type: FETCH_IS_PIPELINES_ENABLED.ERROR, palyoad: e.message });
  }
}

export function* fetchCodeInsightsReportsForCommit(
  commitHash: string,
  accessToken: { token: string }
) {
  const { owner, slug } = yield select(getCurrentPullRequestUrlPieces);
  const url =
    `${baseUrl}/repositories/${owner}/${slug}/commit/${commitHash}` +
    `/reports?page=1&pagelen=${CODE_INSIGHTS_REPORTS_PAGE_SIZE}`;

  try {
    const reports = yield call(fetchWithAccessToken, url, accessToken);
    yield put({
      type: FETCH_CODE_INSIGHTS_REPORTS.SUCCESS,
      payload: reports || [],
    });
  } catch (e) {
    yield put({
      type: FETCH_CODE_INSIGHTS_REPORTS.ERROR,
      payload: e.message,
    });
  }
}

export function* fetchCodeInsightsAnnotationsForReport(
  commitHash: string,
  reportId: string,
  accessToken: { token: string }
) {
  const { owner, slug } = yield select(getCurrentPullRequestUrlPieces);
  const url =
    `${baseUrl}/repositories/${owner}/${slug}/commit/${commitHash}` +
    `/reports/${reportId}/annotations?sort=-severity&page=1`;

  try {
    const annotations = yield call(
      fetchAllPagesWithAccessToken,
      url,
      accessToken,
      CODE_INSIGHTS_ANNOTATIONS_PAGE_SIZE
    );
    yield put({
      type: FETCH_CODE_INSIGHTS_ANNOTATIONS.SUCCESS,
      meta: { reportId },
      payload: annotations || [],
    });
  } catch (e) {
    yield put({
      type: FETCH_CODE_INSIGHTS_ANNOTATIONS.ERROR,
      payload: e.message,
    });
  }
}

export function* fetchIsPipelinesEnabled() {
  try {
    const accessToken = yield call(fetchAccessToken, 'site:JSAPITOKEN');
    yield call(fetchPipelinesConfig, accessToken);
  } catch (e) {
    yield put({ type: FETCH_IS_PIPELINES_ENABLED.ERROR, palyoad: e.message });
  }
}

export function* fetchCodeInsightsReports() {
  try {
    const accessToken = yield call(fetchAccessToken, 'site:JSAPITOKEN');
    const commitHash = yield select(getPullRequestSourceHash);
    yield call(fetchCodeInsightsReportsForCommit, commitHash, accessToken);
  } catch (e) {
    yield put({
      type: FETCH_CODE_INSIGHTS_REPORTS.ERROR,
      payload: e.message,
    });
  }
}

export function* fetchCodeInsightsAnnotations(action: { payload: string }) {
  const accessToken = yield call(fetchAccessToken, 'site:JSAPITOKEN');
  const commitHash = yield select(getPullRequestSourceHash);
  yield call(
    fetchCodeInsightsAnnotationsForReport,
    commitHash,
    action.payload,
    accessToken
  );
}

export default function*() {
  yield all([
    takeLatest(FETCH_IS_PIPELINES_ENABLED.REQUEST, fetchIsPipelinesEnabled),
    takeLatest(FETCH_CODE_INSIGHTS_REPORTS.REQUEST, fetchCodeInsightsReports),
    takeLatest<{ payload: string; type: string }>(
      FETCH_CODE_INSIGHTS_ANNOTATIONS.REQUEST,
      fetchCodeInsightsAnnotations
    ),
  ]);
}
