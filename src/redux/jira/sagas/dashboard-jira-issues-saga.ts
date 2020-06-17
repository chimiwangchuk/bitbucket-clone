import { call, put, select, all } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import urls from 'src/urls/jira';
import {
  getCurrentUser,
  getCurrentUserIsAnonymous,
} from 'src/selectors/user-selectors';
import authRequest from 'src/utils/fetch';
import { captureMessageForResponse } from 'src/utils/sentry';
import { Action } from 'src/types/state';
import { AvailableSite } from 'src/redux/jira/types';
import prefs from 'src/utils/preferences';
import {
  INIT_DASHBOARD_JIRA,
  FETCH_DASHBOARD_JIRA_ISSUES,
  fetchDashboardJiraIssues,
  setDashboardJiraDefaultCloudId,
  fetchDashboardDevActivity,
  FETCH_DASHBOARD_DEV_ACTIVITY,
} from '../actions';
import { authHeader } from '../utils';

const SITE_PREFERENCE_KEY = 'dashboard:jira-issues:site';

function jiraSoftwareActivity(site: AvailableSite): number {
  const product = site.availableProducts.find(
    p => p.productType === 'JIRA_SOFTWARE'
  );
  return product ? product.activityCount : 0;
}

function siteWithMostActivity(availableSites: AvailableSite[]): AvailableSite {
  const sites = [...availableSites];
  sites.sort((a, b) => jiraSoftwareActivity(b) - jiraSoftwareActivity(a));
  return sites[0];
}

export function* fetchAvailableJiraSitesSaga() {
  const isAnonymousUser = yield select(getCurrentUserIsAnonymous);
  if (isAnonymousUser) {
    return [];
  }

  // Note: We're using the available-products API because that way we can do a nice default site selection
  // in case the user has more than one site. Available-products returns an "activityCount" for each site,
  // so we can choose the site where the user has the most activity, which is probably the one they want.
  // But if for some reason in the future the API is no longer available, we can use available-sites instead
  // (we'd just lose the potentially nicer default site selection).
  const url = urls.api.internal.availableProducts();
  const request = authRequest(url);
  const response = yield call(fetch, request);

  if (response.ok) {
    const data = yield response.json();
    // @ts-ignore TODO: fix noImplicitAny error here
    const sites = data.sites.filter(s =>
      // @ts-ignore TODO: fix noImplicitAny error here
      s.availableProducts.find(p => p.productType === 'JIRA_SOFTWARE')
    );
    // @ts-ignore TODO: fix noImplicitAny error here
    sites.sort((a, b) => a.displayName.localeCompare(b.displayName));
    return sites;
  } else if (response.status === 401) {
    return undefined;
  } else {
    yield captureMessageForResponse(
      response,
      'Fetching dashboard Jira sites failed'
    );
    return undefined;
  }
}

export function* fetchDefaultSiteSaga() {
  const user = yield select(getCurrentUser);
  if (user) {
    try {
      const selectedSiteCloudId = yield call(
        prefs.get,
        user.uuid,
        SITE_PREFERENCE_KEY
      );

      yield put(setDashboardJiraDefaultCloudId(selectedSiteCloudId));

      return selectedSiteCloudId;
    } catch (e) {
      Sentry.captureException(e);
      return undefined;
    }
  } else {
    return undefined;
  }
}

export function* saveDefaultSiteSaga(cloudId: string) {
  const user = yield select(getCurrentUser);
  if (user) {
    try {
      if (cloudId === '') {
        yield call(prefs.delete, user.uuid, SITE_PREFERENCE_KEY);
      } else {
        yield call(prefs.set, user.uuid, SITE_PREFERENCE_KEY, cloudId);
      }
    } catch (e) {
      Sentry.captureException(e);
    }
  }
}

export function* initDashboardJira() {
  try {
    const [availableSites, defaultSiteCloudId]: [
      AvailableSite[],
      string
    ] = yield all([
      call(fetchAvailableJiraSitesSaga),
      call(fetchDefaultSiteSaga),
    ]);

    if (availableSites === undefined) {
      yield put({
        type: INIT_DASHBOARD_JIRA.ERROR,
      });
      return;
    }

    if (availableSites.length === 0) {
      if (defaultSiteCloudId) {
        // Clear the preference
        yield call(saveDefaultSiteSaga, '');
      }

      yield put({
        type: INIT_DASHBOARD_JIRA.SUCCESS,
        payload: {
          selectedSite: undefined,
          availableSites: [],
        },
      });
      return;
    }

    const selectedSite =
      availableSites.find(site => site.cloudId === defaultSiteCloudId) ||
      siteWithMostActivity(availableSites);

    yield put({
      type: INIT_DASHBOARD_JIRA.SUCCESS,
      payload: {
        selectedSite,
        availableSites,
      },
    });

    yield put(fetchDashboardJiraIssues(selectedSite));

    if (!defaultSiteCloudId) {
      // If we haven't saved the selected site as a preference yet, save it now so that in case the sites change, we
      // don't suddenly pick a different one for the user. By saving it, it will just stay the same as the initial
      // selection.
      yield call(saveDefaultSiteSaga, selectedSite.cloudId);
    }
  } catch (e) {
    Sentry.captureException(e);
    yield put({
      type: INIT_DASHBOARD_JIRA.ERROR,
    });
  }
}

export function* onSelectedSiteChangeSaga({ payload }: Action<AvailableSite>) {
  if (payload) {
    yield all([
      call(saveDefaultSiteSaga, payload.cloudId),
      put(fetchDashboardJiraIssues(payload)),
    ]);
  }
}

export function* fetchDashboardJiraIssuesSaga({
  payload,
}: Action<AvailableSite>) {
  if (!payload) {
    return;
  }

  const url = urls.api.internal.myIssues(payload.cloudId, 15);

  try {
    const headers = yield authHeader();
    const request = authRequest(url);
    const response = yield call(fetch, request, {
      method: 'GET',
      headers: {
        ...headers,
      },
    });
    if (response.ok) {
      const data = yield response.json();
      yield put({
        type: FETCH_DASHBOARD_JIRA_ISSUES.SUCCESS,
        payload: {
          jiraIssues: data.values,
          jiraIssuesCount: data.size,
          jiraIssuesJql: data.links.jira.jql,
        },
      });
      yield put(
        fetchDashboardDevActivity({
          cloudId: payload.cloudId,
          // @ts-ignore TODO: fix noImplicitAny error here
          issueIds: data.values.map(val => val.id),
        })
      );
    } else {
      yield captureMessageForResponse(
        response,
        'Fetching dashboard Jira issues failed'
      );
      yield put({
        type: FETCH_DASHBOARD_JIRA_ISSUES.ERROR,
      });
    }
  } catch (e) {
    Sentry.captureException(e);
    yield put({
      type: FETCH_DASHBOARD_JIRA_ISSUES.ERROR,
    });
  }
}

export function* fetchDashboardDevActivitySaga({
  payload,
}: Action<{ issueIds: string[]; cloudId: string }>) {
  if (!payload) {
    return;
  }

  const { cloudId, issueIds } = payload;
  const url = urls.api.internal.dashboardDevActivity(cloudId);

  try {
    const headers = yield authHeader();
    const request = authRequest(url);
    const response = yield call(fetch, request, {
      method: 'POST',
      headers: {
        ...headers,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ issueIds }),
    });

    if (response.ok) {
      const data = yield response.json();
      yield put({
        type: FETCH_DASHBOARD_DEV_ACTIVITY.SUCCESS,
        payload: data ? { [cloudId]: data.activity } : {},
      });
    } else {
      yield captureMessageForResponse(
        response,
        'Fetching dashboard Jira issues dev activity information failed'
      );
      yield put({
        type: FETCH_DASHBOARD_DEV_ACTIVITY.ERROR,
      });
    }
  } catch (e) {
    Sentry.captureException(e);
    yield put({
      type: FETCH_DASHBOARD_DEV_ACTIVITY.ERROR,
    });
  }
}
