import { all, call, put, select, take } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import {
  getCurrentUser,
  getCurrentUserIsAnonymous,
  getTargetUser,
} from 'src/selectors/user-selectors';
import authRequest from 'src/utils/fetch';
import { captureMessageForResponse } from 'src/utils/sentry';
import { Action } from 'src/types/state';
import urls from 'src/urls/jira';
import {
  getCurrentRepositoryFullSlug,
  getCurrentRepositoryOwner,
  getCurrentRepositoryOwnerName,
} from 'src/selectors/repository-selectors';
import { getAuthHeader, getTokenDetails } from 'src/utils/get-token-details';
import {
  getIsExpiresDurationInApiToken,
  getIsJiraRepoPageM2Enabled,
} from 'src/selectors/feature-selectors';
import { getRepositoryPageLoadingStatus } from 'src/selectors/global-selectors';
import { LoadingStatus } from 'src/constants/loading-status';
import { publishTrackEvent } from 'src/utils/analytics/publish';
import { LoadRepositoryPage } from 'src/sections/repository/actions';
import { SCREEN_NAME } from 'src/sections/repository/sections/jira/components/jira-tab/constants';
import {
  FETCH_DEV_ACTIVITY,
  FETCH_JIRA_ASSIGNEES,
  FETCH_JIRA_RELEVANT_ISSUES,
  FETCH_JIRA_RELEVANT_PROJECTS,
  FETCH_JIRA_SITES,
  FETCH_RELEVANT_JIRA_SITES,
  FETCH_WORKSPACE_PERMISSION,
  fetchDevActivity,
  fetchJiraAssignees,
  fetchJiraRelevantIssues,
  fetchJiraRelevantProjects,
  fetchJiraSites,
  fetchRelevantJiraSites,
  fetchWorkspacePermission,
  saveFilterState,
  setEmptyStateKind,
} from '../actions';
import {
  Assignee,
  ChangeFilterStateAction,
  FilterState,
  JiraIssue,
  ProjectAssociation,
  Site,
  SORT_ORDER,
} from '../types';
import { EmptyStateKind } from '../constants';
import { authHeader } from '../utils';
import {
  getAssigneesFetchedStatus,
  getAssignees,
  getFilterState,
  getProjectAssociations,
  getRelevantProjectFetchedStatus,
  getRelevantSites,
  getRelevantSitesFetchedStatus,
} from '../selectors/repo-page-selectors';

export function* initJiraRepoPageSaga({
  payload: repositoryFullSlug,
}: Action<string>) {
  const isJiraTabM2Enabled = yield select(getIsJiraRepoPageM2Enabled);
  if (isJiraTabM2Enabled) {
    // Fetch relevant projects from all sites - this feeds both relevant project navigation
    // and project filter of the issues table
    yield put(fetchJiraRelevantProjects());
    // TODO BBCFAM-480 fetch the user preference here in parallel with relevant sites
    // Fetch relevant sites to figure out where to fetch issues from or empty state to show
    yield put(fetchRelevantJiraSites(repositoryFullSlug!));
  } else {
    yield put(fetchJiraSites());
  }
}

export function* fetchJiraTabUserPreferencesSaga() {
  // TODO: BBCFAM-480
}

export function* fetchJiraAssigneesSaga() {
  const repositoryFullSlug = yield select(getCurrentRepositoryFullSlug);
  const { siteCloudId } = yield select(getFilterState);
  const url = urls.api.internal.assignees(repositoryFullSlug, siteCloudId);

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
        type: FETCH_JIRA_ASSIGNEES.SUCCESS,
        payload: {
          values: data.values,
        },
      });
    } else {
      yield captureMessageForResponse(
        response,
        `Fetching assignees for the Jira site ${siteCloudId}`
      );
      yield put({
        type: FETCH_JIRA_ASSIGNEES.ERROR,
      });
    }
  } catch (e) {
    Sentry.captureException(e);
    yield put({
      type: FETCH_JIRA_ASSIGNEES.ERROR,
    });
  }
}

export function* updateEmptyStateForSelectedSite() {
  // To decide which empty state reflects the situation we might need
  // to check the outcome of concurrently executed API calls to fetch
  // relevant sites and relevant projects. Due to visibility of these
  // to the requesting user, we can't make such decision earlier.
  const { siteCloudId } = yield select(getFilterState);
  // If no site selected yet, we are not ready to show the page
  if (!siteCloudId) {
    return;
  }
  const relevantProjectFetchedStatus = yield select(
    getRelevantProjectFetchedStatus
  );
  if (relevantProjectFetchedStatus === LoadingStatus.Forbidden) {
    // No relevant projects are visible to the user, but we can only get
    // into this branch if at least one of the relevant sites is visible
    // and became selected
    yield put(
      setEmptyStateKind(EmptyStateKind.HasNoAccessibleRelevantProjects)
    );
  } else if (relevantProjectFetchedStatus === LoadingStatus.Success) {
    const projectAssociations = yield select(getProjectAssociations);
    // No relevant projects means no relevant sites, for that case we have a special
    // flow to fetch available sites and decide which empty state to show, so here we
    // only need to care about the case when there're some relevant projects
    if (projectAssociations.length > 0) {
      // We might have a site selected which has no relevant projects visible to the user,
      // while there are relevant projects on other sites that user can access; we need to
      // detect such case to show appropriate empty state and hide an empty project filter
      const someVisibleProjectsOnSelectedSite = projectAssociations.some(
        (pa: ProjectAssociation) => pa.project.site.cloudId === siteCloudId
      );
      yield put(
        setEmptyStateKind(
          someVisibleProjectsOnSelectedSite
            ? EmptyStateKind.None
            : EmptyStateKind.HasNoAccessibleRelevantProjects
        )
      );
    }
  } else if (relevantProjectFetchedStatus === LoadingStatus.Failed) {
    // We need to let the user see the page so that they are able to retry fetching
    // relevant projects if they want. Once they do that, empty state might change
    // but that's ok since that would be a reaction on a button click.
    yield put(setEmptyStateKind(EmptyStateKind.None));
  }
}

export function* handleSelectedSiteChange() {
  yield all([
    put(fetchJiraAssignees()),
    put(fetchJiraRelevantIssues()),
    call(updateEmptyStateForSelectedSite),
  ]);
}

export function* fetchSitesSaga() {
  const targetAccount = yield select(getTargetUser);
  const url = urls.api.internal.sites(targetAccount);

  try {
    const currentUser = yield select(getCurrentUser);
    const expiresDurationInApiToken = yield select(
      getIsExpiresDurationInApiToken
    );
    const options = yield call(
      getTokenDetails,
      currentUser && currentUser.uuid,
      expiresDurationInApiToken
    );
    const headers = yield call(getAuthHeader, options);
    const request = authRequest(url);
    const response = yield call(fetch, request, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (response.ok) {
      const data = yield response.json();
      yield put({
        type: FETCH_JIRA_SITES.SUCCESS,
        payload: data.values,
      });
    } else {
      yield captureMessageForResponse(
        response,
        'Fetching Jira sites in Jira tab failed'
      );
      yield put({
        type: FETCH_JIRA_SITES.ERROR,
      });
    }
  } catch (e) {
    Sentry.captureException(e);
    yield put({
      type: FETCH_JIRA_SITES.ERROR,
    });
  }
}

export function* publishIssuesFetchedTrackEvent(size: number, pageLen: number) {
  const relevantSites: Site[] = yield select(getRelevantSites);
  const relevantProjects: ProjectAssociation[] = yield select(
    getProjectAssociations
  );
  const relevantProjectsFetchedStatus: LoadingStatus = yield select(
    getRelevantProjectFetchedStatus
  );
  const assignees: Assignee[] = yield select(getAssignees);
  const assigneesFetchedStatus: LoadingStatus = yield select(
    getAssigneesFetchedStatus
  );
  const filterState: FilterState = yield select(getFilterState);

  yield call(publishTrackEvent, {
    source: SCREEN_NAME,
    action: 'fetched',
    actionSubject: 'jiraTabRelevantIssues',
    actionSubjectId: 'jiraTabRelevantIssues',
    attributes: {
      relevantSitesCount: relevantSites.length,
      relevantProjectsCount:
        relevantProjectsFetchedStatus === LoadingStatus.Success
          ? relevantProjects.length
          : undefined,
      relevantProjectsForSelectedSiteCount:
        relevantProjectsFetchedStatus === LoadingStatus.Success
          ? relevantProjects.filter(
              p => p.project.site.cloudId === filterState.siteCloudId
            ).length
          : undefined,
      assigneesCount:
        assigneesFetchedStatus === LoadingStatus.Success
          ? assignees.length
          : undefined,
      selectedProjectsCount: filterState.projectIds.length,
      selectedAssigneesCount: filterState.assignees.length,
      selectedStatusCategories: filterState.issueCategories,
      isSearchingByText: Boolean(filterState.textFilterQuery),
      sort: filterState.sort,
      currentPage: filterState.currentPage,
      totalPages: Math.ceil(size / pageLen),
    },
  });
}

export function* fetchJiraRelevantIssuesSaga() {
  const RELEVANT_ISSUES_PAGE_LEN = 25;
  const repositoryFullSlug = yield select(getCurrentRepositoryFullSlug);
  const filterState: FilterState = yield select(getFilterState);
  const cloudId = filterState.siteCloudId;
  const url = urls.api.internal.relevantIssues(repositoryFullSlug, {
    cloud_id: cloudId,
    project_ids: filterState.projectIds,
    statuses: filterState.issueCategories,
    text: filterState.textFilterQuery,
    assignees: filterState.assignees,
    sort: filterState.sort
      ? filterState.sort.order === SORT_ORDER.ASC
        ? filterState.sort.field
        : `-${filterState.sort.field}`
      : undefined,
    page: filterState.currentPage,
    pagelen: RELEVANT_ISSUES_PAGE_LEN,
  });

  try {
    const headers = yield authHeader();
    const request = authRequest(url);
    const response = yield call(fetch, request, { headers });

    if (response.ok) {
      const data = yield response.json();
      yield put({
        type: FETCH_JIRA_RELEVANT_ISSUES.SUCCESS,
        payload: data,
      });
      const issues: [JiraIssue] = data.values;
      const issueIds = issues.map(issue => issue.id);
      yield put(
        fetchDevActivity({
          cloudId,
          issueIds,
        })
      );

      yield call(
        publishIssuesFetchedTrackEvent,
        data.size,
        RELEVANT_ISSUES_PAGE_LEN
      );
    } else {
      yield captureMessageForResponse(
        response,
        'Fetching relevant Jira issues in Jira tab failed'
      );
      yield put({
        type: FETCH_JIRA_RELEVANT_ISSUES.ERROR,
      });
    }
  } catch (e) {
    Sentry.captureException(e);
    yield put({
      type: FETCH_JIRA_RELEVANT_ISSUES.ERROR,
    });
  }
}

export function* fetchRelevantJiraSitesSaga({
  payload: repositoryFullSlug,
}: Action<string>) {
  const url = urls.api.internal.relevantSites(repositoryFullSlug!);

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
        type: FETCH_RELEVANT_JIRA_SITES.SUCCESS,
        payload: {
          values: data.values,
          hasPermission: true,
        },
      });
    } else if (response.status === 403) {
      yield put({
        type: FETCH_RELEVANT_JIRA_SITES.SUCCESS,
        payload: {
          values: [],
          hasPermission: false,
        },
      });
    } else {
      yield captureMessageForResponse(
        response,
        'Fetching relevant Jira sites in Jira tab failed'
      );
      yield put({
        type: FETCH_RELEVANT_JIRA_SITES.ERROR,
      });
    }
  } catch (e) {
    Sentry.captureException(e);
    yield put({
      type: FETCH_RELEVANT_JIRA_SITES.ERROR,
    });
  }
}

export function* fetchJiraRelevantProjectsSaga() {
  const repositoryFullSlug = yield select(getCurrentRepositoryFullSlug);
  const url = urls.api.internal.relevantProjects(repositoryFullSlug);

  try {
    const currentUser = yield select(getCurrentUser);
    const expiresDurationInApiToken = yield select(
      getIsExpiresDurationInApiToken
    );
    const options = yield call(
      getTokenDetails,
      currentUser && currentUser.uuid,
      expiresDurationInApiToken
    );
    const headers = yield call(getAuthHeader, options);
    const request = authRequest(url);
    const response = yield call(fetch, request, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (response.ok) {
      const data = yield response.json();
      yield put({
        type: FETCH_JIRA_RELEVANT_PROJECTS.SUCCESS,
        payload: {
          values: data.values,
          hasPermission: true,
        },
      });
    } else if (response.status === 403) {
      yield put({
        type: FETCH_JIRA_RELEVANT_PROJECTS.SUCCESS,
        payload: {
          values: [],
          hasPermission: false,
        },
      });
    } else {
      yield captureMessageForResponse(
        response,
        'Fetching relevant Jira projects failed'
      );
      yield put({
        type: FETCH_JIRA_RELEVANT_PROJECTS.ERROR,
      });
    }
  } catch (e) {
    Sentry.captureException(e);
    yield put({
      type: FETCH_JIRA_RELEVANT_PROJECTS.ERROR,
    });
  }
}

export function* handleFetchRelevantIssuesSuccessSaga({
  payload,
}: Action<{ values: JiraIssue[] }>) {
  // If we got some issues back, we can show them straight away
  // without waiting for all relevant projects to finish loading
  if ((payload?.values || []).length > 0) {
    yield put(setEmptyStateKind(EmptyStateKind.None));
  }
}

export function* handleFetchRelevantProjectsSuccessSaga() {
  yield call(updateEmptyStateForSelectedSite);
}

export function* handleFetchRelevantSitesSuccessSaga() {
  // Make sure the repository has been loaded.
  const { status } = yield select(getRepositoryPageLoadingStatus);
  if (status !== LoadingStatus.Success) {
    yield take(LoadRepositoryPage.SUCCESS);
  }

  const relevantSites = yield select(getRelevantSites);
  if ((relevantSites || []).length === 0) {
    const relevantSitesFetchStatus = yield select(
      getRelevantSitesFetchedStatus
    );
    if (relevantSitesFetchStatus === LoadingStatus.Forbidden) {
      yield put(setEmptyStateKind(EmptyStateKind.HasNoAccessibleRelevantSites));
    } else {
      yield put(fetchJiraSites());
    }
  } else {
    const filterState = yield select(getFilterState);
    if (!filterState.siteCloudId) {
      yield put(saveFilterState({ siteCloudId: relevantSites![0].cloudId }));
    }
    yield call(handleSelectedSiteChange);
  }
}

export function* handleFetchSitesSuccessSaga({
  payload: sites,
}: Action<Site[]>) {
  const connectedSites = (sites || []).filter(s => s.connected);
  const availableSites = (sites || []).filter(s => !s.connected);
  const isJiraTabM2Enabled = yield select(getIsJiraRepoPageM2Enabled);
  if (connectedSites.length > 0) {
    // If Jira issues tab is enabled, we're only fetching all Jira sites
    // if there're no relevant sites, and therefore no relevant projects.
    // For the old Jira Software tab this is a connected state.
    yield put(
      setEmptyStateKind(
        isJiraTabM2Enabled
          ? EmptyStateKind.HasNoRelevantProjects
          : EmptyStateKind.None
      )
    );
  } else if (connectedSites.length === 0 && availableSites.length > 0) {
    yield put(setEmptyStateKind(EmptyStateKind.HasAvailableSites));
    yield put(fetchWorkspacePermission());
  } else if (connectedSites.length === 0 && availableSites.length === 0) {
    yield put(setEmptyStateKind(EmptyStateKind.HasNoAvailableSites));
    yield put(fetchWorkspacePermission());
  }
}

export function* fetchWorkspacePermissionSaga() {
  const isAnonymousUser = yield select(getCurrentUserIsAnonymous);
  // Request to get workspace permissions needs auth, don't try for anonymous users.
  if (isAnonymousUser) {
    yield put({
      type: FETCH_WORKSPACE_PERMISSION.SUCCESS,
      payload: [],
    });
    return;
  }

  const repoOwnerName = yield select(getCurrentRepositoryOwnerName);
  const url = urls.api.v20.workspacePermission(repoOwnerName);

  try {
    const request = authRequest(url);
    const response = yield call(fetch, request);

    if (response.ok) {
      const data = yield response.json();
      yield put({
        type: FETCH_WORKSPACE_PERMISSION.SUCCESS,
        payload: data.values,
      });
    } else {
      yield captureMessageForResponse(
        response,
        'Fetching workspace permission in Jira tab failed'
      );
      yield put({
        type: FETCH_WORKSPACE_PERMISSION.ERROR,
      });
    }
  } catch (e) {
    Sentry.captureException(e);
    yield put({
      type: FETCH_WORKSPACE_PERMISSION.ERROR,
    });
  }
}

export function* updateFilterUserPreferenceApiSaga() {
  // TODO: BBCFAM-480
}

export function* changeFilterStateSaga({
  payload: nextFilterState,
}: ChangeFilterStateAction) {
  const prevFilterState = yield select(getFilterState);

  const filterState = { ...nextFilterState };

  const filtersOrSortChanged = !nextFilterState.currentPage;
  if (filtersOrSortChanged) {
    // When changing any of the filters or sort order, we want to reset to page 1, not stay on the page that they were
    // before because the context is no longer the same. See https://ux.stackexchange.com/a/129076/68221
    filterState.currentPage = 1;
  }

  const selectedSiteChanged =
    nextFilterState.siteCloudId &&
    nextFilterState.siteCloudId !== prevFilterState.siteCloudId;
  if (selectedSiteChanged) {
    // When switching to a different site, we don't want to keep the project or assignee filters. For projects it
    // doesn't make sense because they are completely different. The same assignee user might exist on a different site,
    // but might not have any issues on that site, so it would just be an empty result and confusing UX.
    filterState.projectIds = [];
    filterState.assignees = [];
  }
  yield put(saveFilterState(filterState));

  // TODO BBCFAM-480, update user preference here
  if (selectedSiteChanged) {
    // TODO BBCFAM-480, retrieve user preference here
    yield call(handleSelectedSiteChange);
  } else {
    yield put(fetchJiraRelevantIssues());
  }
}

export function* fetchDevActivitySaga({
  payload,
}: Action<{ issueIds: string[]; cloudId: string }>) {
  if (!payload) {
    return;
  }

  const repoOwner = yield select(getCurrentRepositoryOwner);

  const { cloudId, issueIds } = payload;
  const url = urls.api.internal.devActivity(repoOwner, cloudId);

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
        type: FETCH_DEV_ACTIVITY.SUCCESS,
        payload: data ? { [cloudId]: data.activity } : {},
      });
    } else {
      yield captureMessageForResponse(
        response,
        'Fetching dev activity in Jira tab failed'
      );
      yield put({
        type: FETCH_DEV_ACTIVITY.ERROR,
      });
    }
  } catch (e) {
    Sentry.captureException(e);
    yield put({
      type: FETCH_DEV_ACTIVITY.ERROR,
    });
  }
}
