export enum AppInstalledStatus {
  Before = 'BEFORE',
  Fetching = 'FETCHING',
  NotInstalled = 'NOT_INSTALLED',
  Installed = 'INSTALLED',
  Installing = 'INSTALLING',
  FailedToInstall = 'FAILED_TO_INSTALL',
  FailedToFetch = 'FAILED_TO_FETCH',
}

export enum WorkspacePermission {
  Member = 'member',
  Collaborator = 'collaborator',
  Owner = 'owner',
}

export enum EmptyStateKind {
  Before = 'BEFORE',
  None = 'NONE',
  HasAvailableSites = 'HAS_AVAILABLE_SITES',
  HasNoAvailableSites = 'HAS_NO_AVAILABLE_SITES',
  HasNoRelevantProjects = 'HAS_NO_RELEVANT_PROJECTS',
  HasNoAccessibleRelevantProjects = 'HAS_NO_ACCESSIBLE_RELEVANT_PROJECTS',
  HasNoAccessibleRelevantSites = 'HAS_NO_ACCESSIBLE_RELEVANT_SITES',
}

export enum IssueCreationFailureReason {
  None = 'NONE',
  Unknown = 'UNKNOWN',
  UnsupportedFields = 'UNSUPPORTED_FIELDS',
}

export enum OnboardingViewed {
  Seen = 'SEEN',
  Unseen = 'UNSEEN',
}

export enum DevActivityKind {
  Branch = 'branch',
  // This is named 'repository' to conform to Jira's naming conventions.
  // It really represents a commit made against an issue.
  Commit = 'repository',
  PullRequest = 'pullrequest',
}

export enum IssueCategory {
  Todo = 'new',
  InProgress = 'indeterminate',
  Done = 'done',
}

export const ONBOARDING_VIEWED_PREF_KEY = 'viewed-create-jira-issue-onboarding';
