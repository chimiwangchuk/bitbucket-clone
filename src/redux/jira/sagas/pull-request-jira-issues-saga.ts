import { call, put, select } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import { Action } from 'src/types/state';
import urls from 'src/urls/jira';
import authRequest from 'src/utils/fetch';
import { captureMessageForResponse } from 'src/utils/sentry';
import { EnteredCodeReviewAction } from 'src/redux/pull-request/actions';
import { getCurrentRepositoryFullSlug } from 'src/selectors/repository-selectors';
import { getCurrentPullRequestId } from 'src/redux/pull-request/selectors';
import {
  FETCH_PULL_REQUEST_JIRA_ISSUES,
  FETCH_AVAILABLE_ISSUE_TRANSITIONS,
  TRANSITION_ISSUES,
} from '../actions';
import { authHeader } from '../utils';
import { getIssueTransitionForm } from '../selectors/jira-issue-selectors';
import { IssueTransitionFormRowData } from '../types';

export function* fetchPullRequestJiraIssuesSaga({
  owner,
  slug,
  id: pullRequestId,
}: EnteredCodeReviewAction) {
  const repositoryFullSlug = `${owner}/${slug}`;
  const url = urls.api.internal.issues(repositoryFullSlug, pullRequestId!);

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
        type: FETCH_PULL_REQUEST_JIRA_ISSUES.SUCCESS,
        payload: data.values,
      });
    } else {
      yield captureMessageForResponse(
        response,
        'Fetching PR Jira issues failed'
      );
      yield put({
        type: FETCH_PULL_REQUEST_JIRA_ISSUES.ERROR,
      });
    }
  } catch (e) {
    Sentry.captureException(e);
    yield put({
      type: FETCH_PULL_REQUEST_JIRA_ISSUES.ERROR,
    });
  }
}

export function* transitionIssuesSaga() {
  const repositoryFullSlug = yield select(getCurrentRepositoryFullSlug);
  const pullRequestId = yield select(getCurrentPullRequestId);
  const issueTransitionForm = yield select(getIssueTransitionForm);
  const issueTransitions = issueTransitionForm.filter(
    (issue: IssueTransitionFormRowData) => issue.shouldTransition
  );

  try {
    const url = urls.api.internal.transitions(
      repositoryFullSlug,
      pullRequestId!
    );
    const headers = yield authHeader();
    const request = authRequest(url);
    const body = {
      transitions: issueTransitions.map(
        (transition: IssueTransitionFormRowData) => {
          return {
            cloudId: transition.selectedIssue?.issue.site.cloudId,
            issueKeyOrId: transition.selectedIssue?.issue.key,
            transitionId: transition.selectedTransition?.id,
          };
        }
      ),
    };
    const response = yield call(fetch, request, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      yield put({
        type: TRANSITION_ISSUES.SUCCESS,
      });
    } else {
      yield captureMessageForResponse(response, 'Transitioning issue failed');
      yield put({
        type: TRANSITION_ISSUES.ERROR,
      });
    }
  } catch (e) {
    Sentry.captureException(e);
    yield put({
      type: TRANSITION_ISSUES.ERROR,
    });
  }
}

export function* fetchAvailableIssueTransitionsSaga({
  payload: index,
}: Action<number>) {
  const issueTransitionForm = yield select(getIssueTransitionForm);
  try {
    const prIssue = issueTransitionForm[index!].selectedIssue;
    const url = urls.api.internal.availableTransitions(
      prIssue.issue.site.cloudId,
      prIssue.issue.key
    );
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
        type: FETCH_AVAILABLE_ISSUE_TRANSITIONS.SUCCESS,
        payload: {
          availableIssueTransitions: data,
          index,
        },
      });
    } else {
      yield captureMessageForResponse(
        response,
        'Fetching available issue transitions failed'
      );
      yield put({
        type: FETCH_AVAILABLE_ISSUE_TRANSITIONS.ERROR,
      });
    }
  } catch (e) {
    Sentry.captureException(e);
    yield put({
      type: FETCH_AVAILABLE_ISSUE_TRANSITIONS.ERROR,
    });
  }
}
