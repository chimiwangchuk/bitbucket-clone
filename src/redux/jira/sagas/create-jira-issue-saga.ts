import { call, debounce, put, select, take } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import prefs from 'src/utils/preferences';
import urls from 'src/urls/jira';
import { LoadRepositoryPage } from 'src/sections/repository/actions';
import { getCurrentUser } from 'src/selectors/user-selectors';
import authRequest from 'src/utils/fetch';
import { captureMessageForResponse } from 'src/utils/sentry';
import { Action } from 'src/types/state';
import { EnteredCodeReviewAction } from 'src/redux/pull-request/actions';
import {
  getCurrentRepositoryFullSlug,
  getCurrentRepositoryOwner,
} from 'src/selectors/repository-selectors';
import { LoadingStatus } from 'src/constants/loading-status';
import {
  CREATE_JIRA_ISSUE,
  FETCH_CONNECTED_JIRA_SITES,
  FETCH_JIRA_PROJECT,
  FETCH_JIRA_PROJECTS_FOR_SITE,
  FETCH_JIRA_ISSUE_CREATION_METADATA,
  FETCH_CREATE_JIRA_ISSUE_ONBOARDING_VIEWED,
  FETCH_CREATE_JIRA_ISSUE_PREFERENCES,
  UPDATE_CREATE_JIRA_ISSUE_ONBOARDING_VIEWED,
  UPDATE_CREATE_JIRA_ISSUE_PREFERENCES,
  fetchConnectedJiraSites,
  fetchCreateJiraIssuePreferences,
  fetchJiraProject,
  onCreateJiraIssueFormChangeVisibility,
  setFormErrorState,
  updateCreateJiraIssuePreferences,
  updateJiraIssuesListAfterCreation,
} from '../actions';
import { Site, CreatePrCommentIssuePayload, IssueType } from '../types';
import {
  ONBOARDING_VIEWED_PREF_KEY,
  IssueCreationFailureReason,
  OnboardingViewed,
} from '../constants';
import { createJiraIssueUserPreferencesKey, authHeader } from '../utils';

function* getRepoOwner() {
  // Wait for the current repository page to be loaded
  // so that we can access the repositoryOwner in subsequent sagas.
  let repoOwner = yield select(getCurrentRepositoryOwner);
  if (!repoOwner) {
    yield take(LoadRepositoryPage.SUCCESS);
    repoOwner = yield select(getCurrentRepositoryOwner);
  }

  return repoOwner;
}

export function* initCreateJiraIssueSaga(action: EnteredCodeReviewAction) {
  const { owner, slug } = action;
  const repositoryFullSlug = `${owner}/${slug}`;

  yield put(fetchCreateJiraIssuePreferences(repositoryFullSlug));
  yield put(fetchConnectedJiraSites());
}

export function* fetchConnectedJiraSitesSaga() {
  const repoOwner = yield getRepoOwner();
  const url = urls.api.internal.connectedSites(repoOwner);

  try {
    const headers = yield authHeader();
    const request = authRequest(url);
    const response = yield call(fetch, request, {
      headers,
    });

    if (response.ok) {
      const data = yield response.json();
      yield put({
        type: FETCH_CONNECTED_JIRA_SITES.SUCCESS,
        payload: data.values,
      });
    } else {
      yield captureMessageForResponse(
        response,
        'Fetching Jira sites in PR failed'
      );
      yield put({
        type: FETCH_CONNECTED_JIRA_SITES.ERROR,
      });
    }
  } catch (e) {
    Sentry.captureException(e);
    yield put({
      type: FETCH_CONNECTED_JIRA_SITES.ERROR,
    });
  }
}

export function* fetchJiraProjectSaga({
  payload,
}: Action<{ cloudId: string; projectId: string }>) {
  const { cloudId, projectId } = payload!;
  const repoOwner = yield getRepoOwner();
  const url = urls.api.internal.project(repoOwner, cloudId, projectId);

  try {
    const headers = yield authHeader();
    const request = authRequest(url);
    const response = yield call(fetch, request, {
      headers,
    });

    if (response.ok) {
      const data = yield response.json();

      yield put({
        type: FETCH_JIRA_PROJECT.SUCCESS,
        payload: {
          [cloudId]: {
            project: data,
            fetchedStatus: LoadingStatus.Success,
          },
        },
      });
    } else {
      yield captureMessageForResponse(response, 'Fetching Jira project failed');
      yield put({
        type: FETCH_JIRA_PROJECT.ERROR,
        payload: {
          [cloudId]: {
            project: {},
            fetchedStatus: LoadingStatus.Failed,
          },
        },
      });
    }
  } catch (e) {
    Sentry.captureException(e);
    yield put({
      type: FETCH_JIRA_PROJECT.ERROR,
      payload: {
        [cloudId]: {
          project: {},
          fetchedStatus: LoadingStatus.Failed,
        },
      },
    });
  }
}

export function* fetchJiraProjectsForSiteSaga({
  payload,
}: Action<{ site: Site; projectFilter: string }>) {
  const { site, projectFilter } = payload!;
  const cloudId = site ? site.cloudId : '';

  const repoOwner = yield select(getCurrentRepositoryOwner);
  const url = urls.api.internal.projects(repoOwner, cloudId, projectFilter);

  try {
    const headers = yield authHeader();
    const request = authRequest(url);
    const response = yield call(fetch, request, {
      headers,
    });

    if (response.status === 403) {
      yield put({
        type: FETCH_JIRA_PROJECTS_FOR_SITE.ERROR,
        payload: {
          [cloudId]: {
            list: [],
            fetchedStatus: LoadingStatus.Forbidden,
          },
        },
      });
    } else if (!response.ok) {
      yield captureMessageForResponse(
        response,
        'Fetching Jira projects for a site failed'
      );
      yield put({
        type: FETCH_JIRA_PROJECTS_FOR_SITE.ERROR,
        payload: {
          [cloudId]: {
            list: [],
            fetchedStatus: LoadingStatus.Failed,
          },
        },
      });
    } else {
      const data = yield response.json();
      yield put({
        type: FETCH_JIRA_PROJECTS_FOR_SITE.SUCCESS,
        payload: {
          [cloudId]: {
            list: data.values,
            fetchedStatus: LoadingStatus.Success,
          },
        },
      });
    }
  } catch (e) {
    Sentry.captureException(e);
    yield put({
      type: FETCH_JIRA_PROJECTS_FOR_SITE.ERROR,
      payload: {
        [cloudId]: {
          list: [],
          fetchedStatus: LoadingStatus.Failed,
        },
      },
    });
  }
}

export function* fetchDebouncedJiraProjectsForSiteSaga() {
  yield debounce(
    400,
    FETCH_JIRA_PROJECTS_FOR_SITE.REQUEST,
    fetchJiraProjectsForSiteSaga
  );
}

export function* fetchJiraIssueCreationMetadataSaga({
  payload,
}: Action<{ cloudId: string; projectId: string }>) {
  if (!payload) {
    return;
  }

  const { cloudId, projectId } = payload;

  const repoOwner = yield select(getCurrentRepositoryOwner);
  const url = urls.api.internal.issueCreationMetadata(
    repoOwner,
    cloudId,
    projectId
  );

  try {
    const headers = yield authHeader();
    const request = authRequest(url);
    const response = yield call(fetch, request, {
      headers,
    });

    if (!response.ok) {
      const { status } = response;
      if (status === 403) {
        yield put({
          type: FETCH_JIRA_ISSUE_CREATION_METADATA.ERROR,
          payload: {
            cloudId,
            projectId,
            fetchedStatus: LoadingStatus.Forbidden,
          },
        });
      } else {
        yield captureMessageForResponse(
          response,
          'Fetching Jira issue creation metadata failed'
        );
        yield put({
          type: FETCH_JIRA_ISSUE_CREATION_METADATA.ERROR,
          payload: {
            cloudId,
            fetchedStatus: LoadingStatus.Failed,
            projectId,
          },
        });
      }
    } else {
      const data = yield response.json();
      // Filter "subtask" out
      const issueTypes = (data.issuetypes || []).filter(
        // @ts-ignore TODO: fix noImplicitAny error here
        ({ subtask }) => !subtask
      );
      yield put({
        type: FETCH_JIRA_ISSUE_CREATION_METADATA.SUCCESS,
        payload: {
          cloudId,
          projectId,
          issueTypes,
        },
      });
    }
  } catch (e) {
    Sentry.captureException(e);
    yield put({
      type: FETCH_JIRA_ISSUE_CREATION_METADATA.ERROR,
      payload: {
        cloudId,
        projectId,
        fetchedStatus: LoadingStatus.Failed,
      },
    });
  }
}

const supportedFields = ['issuetype', 'summary', 'project', 'reporter'];

export function* handleUnsupportedFieldsErrorSaga({
  payload,
}: Action<{ issueType: IssueType; commentId: number }>) {
  const { issueType, commentId } = payload as {
    issueType: IssueType;
    commentId: number;
  };

  let hasUnsupportedFields = false;

  if (issueType.fields) {
    const { fields } = issueType;

    hasUnsupportedFields = Object.keys(fields).some(fieldKey => {
      if (fields[fieldKey] && fields[fieldKey].required) {
        // Check if any of the required fields are not supported
        return !supportedFields.find(f => f === fieldKey);
      }
      return false;
    });
  }

  if (hasUnsupportedFields) {
    yield put(
      setFormErrorState({
        commentId,
        failureReason: IssueCreationFailureReason.UnsupportedFields,
        status: LoadingStatus.Failed,
      })
    );
  } else {
    yield put(
      setFormErrorState({
        commentId,
        failureReason: IssueCreationFailureReason.None,
        status: LoadingStatus.Before,
      })
    );
  }
}

export function* createJiraIssueSaga({
  payload,
}: Action<CreatePrCommentIssuePayload & { pullRequestId: number }>) {
  const repositoryFullSlug = yield select(getCurrentRepositoryFullSlug);

  if (!payload) {
    return;
  }

  const { pullRequestId, ...requestPayload } = payload;
  const url = urls.api.internal.issues(repositoryFullSlug, pullRequestId);

  try {
    const headers = yield authHeader();
    const request = authRequest(url);
    const response = yield call(fetch, request, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    if (response.ok) {
      // Hide the form after successful creation.
      yield put(
        onCreateJiraIssueFormChangeVisibility({
          commentId: payload.commentId,
          isVisible: false,
        })
      );

      // Update the Jira issues list to include the newly created issue
      const newIssue = yield response.json();
      yield put(updateJiraIssuesListAfterCreation(newIssue));

      yield put({
        type: CREATE_JIRA_ISSUE.SUCCESS,
        payload: {
          commentId: payload.commentId,
        },
      });

      yield put(
        updateCreateJiraIssuePreferences({
          cloudId: requestPayload.cloudId,
          projectId: requestPayload.projectId,
          repositoryFullSlug,
        })
      );
    } else {
      yield captureMessageForResponse(response, 'Creating Jira issue failed');
      yield put({
        type: CREATE_JIRA_ISSUE.ERROR,
        payload: {
          commentId: payload.commentId,
          failureReason: IssueCreationFailureReason.Unknown,
        },
      });
    }
  } catch (e) {
    Sentry.captureException(e);
    yield put({
      type: CREATE_JIRA_ISSUE.ERROR,
      payload: {
        commentId: payload.commentId,
        failureReason: IssueCreationFailureReason.Unknown,
      },
    });
  }
}

export function* fetchCreateJiraIssueOnboardingViewedSaga() {
  const user = yield select(getCurrentUser);
  if (!user || !user.uuid) {
    return;
  }

  try {
    const onboardingViewed = yield call(
      prefs.get,
      user.uuid,
      ONBOARDING_VIEWED_PREF_KEY
    );

    // If onboardingViewed = undefined, the preference hasn't set yet.
    // Which means the user has not seen the onboarding.
    yield put({
      type: FETCH_CREATE_JIRA_ISSUE_ONBOARDING_VIEWED.SUCCESS,
      payload: onboardingViewed || OnboardingViewed.Unseen,
    });
  } catch {
    Sentry.captureException(
      `Failed to get the ${ONBOARDING_VIEWED_PREF_KEY} preference`
    );
    // If fetching the preference fails for any reason, assume the user
    // has seen onboarding already. We don't want to show the onboarding more than once.
    yield put({
      type: FETCH_CREATE_JIRA_ISSUE_ONBOARDING_VIEWED.SUCCESS,
      payload: OnboardingViewed.Seen,
    });
  }
}

export function* updateCreateJiraIssueOnboardingViewedSaga({
  payload: onboardingViewed,
}: Action<OnboardingViewed>) {
  const user = yield select(getCurrentUser);
  if (!user || !user.uuid) {
    return;
  }

  try {
    yield call(
      prefs.set,
      user.uuid,
      ONBOARDING_VIEWED_PREF_KEY,
      onboardingViewed
    );
    yield put({
      type: UPDATE_CREATE_JIRA_ISSUE_ONBOARDING_VIEWED.SUCCESS,
      payload: onboardingViewed,
    });
  } catch (e) {
    Sentry.captureException(e);
    // If setting the preference fails for any reason, set viewed == SEEN.
    // We don't want to show the onboarding more than once.
    yield put({
      type: UPDATE_CREATE_JIRA_ISSUE_ONBOARDING_VIEWED.SUCCESS,
      payload: OnboardingViewed.Seen,
    });
  }
}

export function* fetchCreateJiraIssuePreferencesSaga({
  payload,
}: Action<{ repositoryFullSlug: string }>) {
  const user = yield select(getCurrentUser);
  if (!user || !user.uuid) {
    return;
  }

  const { repositoryFullSlug } = payload!;

  try {
    const preferencesRaw = yield call(
      prefs.get,
      user.uuid,
      createJiraIssueUserPreferencesKey(repositoryFullSlug)
    );
    const preferences = preferencesRaw ? JSON.parse(preferencesRaw) : undefined;

    yield put({
      type: FETCH_CREATE_JIRA_ISSUE_PREFERENCES.SUCCESS,
      payload: preferences,
    });

    if (preferences) {
      yield put(
        fetchJiraProject({
          cloudId: preferences.cloudId,
          projectId: preferences.projectId,
        })
      );
    }
  } catch (e) {
    Sentry.captureException(e);
    yield put({
      type: FETCH_CREATE_JIRA_ISSUE_PREFERENCES.ERROR,
    });
  }
}

export function* updateCreateJiraIssuePreferencesSaga({
  payload,
}: Action<{
  cloudId: string;
  projectId: string;
  repositoryFullSlug: string;
}>) {
  const user = yield select(getCurrentUser);
  if (!user || !user.uuid) {
    return;
  }

  const { cloudId, projectId, repositoryFullSlug } = payload!;
  const preferences = {
    cloudId,
    projectId,
  };

  try {
    yield call(
      prefs.set,
      user.uuid,
      createJiraIssueUserPreferencesKey(repositoryFullSlug),
      JSON.stringify(preferences)
    );
    yield put({
      type: UPDATE_CREATE_JIRA_ISSUE_PREFERENCES.SUCCESS,
      payload: preferences,
    });
  } catch (e) {
    Sentry.captureException(e);
    yield put({
      type: UPDATE_CREATE_JIRA_ISSUE_PREFERENCES.ERROR,
    });
  }
}
