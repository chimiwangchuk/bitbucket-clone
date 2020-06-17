import { BRANCH_KIND } from 'src/constants/branching-model';
import { BranchType } from './types';

export const CREATE_BRANCH_FORM_ID = 'create-branch-form';

export enum CREATE_FROM {
  REPO_DIALOG = 'createBranchDialog',
  GLOBAL_DIALOG = 'createBranchDialogGlobal',
  REPO_PAGE = 'createBranchScreen',
  GLOBAL_PAGE = 'createBranchScreenGlobal',
}

export enum EXTENDED_BRANCH_KINDS {
  OTHER = 'other',
}

export type AllBranchTypes = BRANCH_KIND | EXTENDED_BRANCH_KINDS;

export const BRANCH_TYPE_OTHER: BranchType = Object.freeze({
  kind: EXTENDED_BRANCH_KINDS.OTHER,
  prefix: '',
});

export enum LOADING_STATE {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export enum CREATE_BRANCH_ERROR_TYPE {
  BRANCH_ALREADY_EXISTS = 'BRANCH_ALREADY_EXISTS',
  BRANCH_PERMISSION_VIOLATED = 'BRANCH_PERMISSION_VIOLATED',
  GENERIC = 'GENERIC',
  INSUFFICIENT_RIGHTS = 'INSUFFICIENT_RIGHTS',
  INVALID_BRANCH_NAME = 'INVALID_BRANCH_NAME',
  OTHER = 'OTHER',
}

/**
 * Added `NAMED_BRANCH`. HG repos return branch type - `NAMED_BRANCH` and the Git repos - `BRANCH`
 */
export enum REF_TYPE {
  BRANCH = 'BRANCH',
  NAMED_BRANCH = 'NAMED_BRANCH',
  TAG = 'TAG',
}

export const JIRA_ISSUE_MAPPING_MESSAGE_SHOWN =
  'create-branch.jira-issue-mapping-message.shown';

// Mapping from Jira issue type to BRANCH_KIND.
export const JIRA_ISSUE_TYPE_MAPPING = Object.freeze({
  enhancement: BRANCH_KIND.FEATURE,
  feature: BRANCH_KIND.FEATURE,
  improvement: BRANCH_KIND.FEATURE,
  'new feature': BRANCH_KIND.FEATURE,
  story: BRANCH_KIND.FEATURE,
  'user story': BRANCH_KIND.FEATURE,
});

// These are the issue types from Jira that we send analytics events for. They are made up of standard Jira issue types
// and ones commonly used in production.
export const SAFE_JIRA_ISSUE_TYPES = Object.freeze([
  'bug',
  'change',
  'defect',
  'enhancement',
  'epic',
  'feature',
  'improvement',
  'incident',
  'new feature',
  'problem',
  'service request',
  'story',
  'sub-task',
  'task',
  'technical task',
  'user story',
]);

export const JIRA_BUG_KEYS = ['bug', 'defect'];
