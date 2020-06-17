import qs from 'qs';

import store from 'src/utils/store';
import { BRANCH_KIND } from 'src/constants/branching-model';
import { JiraIssue } from './types';
import {
  AllBranchTypes,
  JIRA_BUG_KEYS,
  EXTENDED_BRANCH_KINDS,
  JIRA_ISSUE_TYPE_MAPPING,
  SAFE_JIRA_ISSUE_TYPES,
} from './constants';
import { sanitizeBranchName, sanitizeIssueSummary } from './utils';

const getProjectFromIssueKey = (issueKey: string): string => {
  return issueKey.split('-')[0];
};

const getStorageKey = (issue: JiraIssue): string | null | undefined => {
  return (issue.project && `bb-jira-repo-map-${issue.project}`) || null;
};

export const setRepositoryForIssue = (
  issue: JiraIssue,
  repository: string
): void => {
  const storageKey = getStorageKey(issue);
  if (storageKey) {
    store.set(storageKey, repository);
  }
};

export const getRepositoryForIssue = (
  issue: JiraIssue
): string | null | undefined => {
  const storageKey = getStorageKey(issue);
  return (storageKey && store.get(storageKey)) || null;
};

export const generateBranchNameFromIssue = (issue: JiraIssue): string => {
  let result = '';
  const summary = sanitizeIssueSummary(
    issue.summary ? issue.summary.toLowerCase() : ''
  );

  if (issue.key && summary) {
    result = `${issue.key}-${summary}`;
  } else if (issue.key) {
    result = issue.key;
  } else if (summary) {
    result = summary;
  }

  result = sanitizeBranchName(result);
  return result.slice(0, 40);
};

export const parseIssueFromQueryString = (query: string): JiraIssue | null => {
  const parsed: { [key: string]: any } = qs.parse(query, {
    ignoreQueryPrefix: true,
  });
  const key = (parsed.issueKey || '').trim();
  const summary = (parsed.issueSummary || '').trim();
  const type = (parsed.issueType || '').trim();

  if (key || summary || type) {
    const issue: JiraIssue = {};
    if (key) {
      issue.key = key;
      issue.project = getProjectFromIssueKey(key);
    }
    if (summary) {
      issue.summary = summary;
    }
    if (type) {
      issue.type = type;
    }
    return issue;
  }
  return null;
};

export const branchTypeFromIssue = (
  issue: JiraIssue,
  isBugfixEnabled: boolean
): AllBranchTypes => {
  if (issue.type) {
    const key = issue.type.toLowerCase();
    if (JIRA_BUG_KEYS.includes(key)) {
      if (isBugfixEnabled) {
        return BRANCH_KIND.BUG_FIX;
      } else {
        return BRANCH_KIND.FEATURE;
      }
    } else {
      // @ts-ignore TODO: fix noImplicitAny error here
      return JIRA_ISSUE_TYPE_MAPPING[key] || EXTENDED_BRANCH_KINDS.OTHER;
    }
  }
  return EXTENDED_BRANCH_KINDS.OTHER;
};

export const getJiraIssueTypeForAnalytics = (issue: JiraIssue) => {
  if (issue.type) {
    const type = issue.type.toLowerCase();
    if (SAFE_JIRA_ISSUE_TYPES.includes(type)) {
      return type;
    }
  }
  return 'custom';
};
