import { BuildStatus } from 'src/components/types';

export type Conflict = {
  path: string;
  message: string;
  scenario: string;
};

export enum MergeCheckKey {
  MINIMUM_APPROVALS = 'minimum_approvals',
  MINIMUM_DEFAULT_REVIEWER_APPROVALS = 'minimum_default_reviewer_approvals',
  MINIMUM_SUCCESSFUL_BUILDS = 'minimum_successful_builds',
  FAILED_BUILDS = 'failed_builds',
  RESOLVED_TASKS = 'resolved_tasks',
  PR_DEPS_MERGED = 'pr_deps_merged',
}

export type MergeCheck = {
  allow_merge: boolean;
  errors: any[];
  key: MergeCheckKey;
  label?: string;
  name: string;
  pass: boolean;
};

export type BuildStatusesMap = {
  FAILED: number;
  INPROGRESS: number;
  STOPPED: number;
  SUCCESSFUL: number;
};

export type BuildStatusCount = {
  state: 'SUCCESSFUL' | 'FAILED' | 'INPROGRESS' | 'STOPPED';
  total_counts: number;
  commit_status: BuildStatus;
  status_counts: BuildStatusesMap;
};

export type BuildStatusCountsMap = { [hash: string]: BuildStatusCount };
