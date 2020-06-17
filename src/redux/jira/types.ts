import { Repository } from 'src/components/types';
import { LoadingStatus } from 'src/constants/loading-status';
import {
  DevActivityKind,
  IssueCreationFailureReason,
  IssueCategory,
} from './constants';

export type Site = {
  cloudId: string;
  cloudName: string;
  cloudUrl: string;
  connected: boolean;
};

type AvatarUrls = {
  '16x16': string;
  '24x24': string;
  '32x32': string;
  '48x48': string;
  '128x128'?: string;
};

export type AvailableSite = {
  cloudId: string;
  displayName: string;
  url: string;
  avatar: string;
  availableProducts: Array<{
    productType: string;
    activityCount: number;
  }>;
};

export type Project = {
  avatarUrls: AvatarUrls;
  id: string;
  key: string;
  name: string;
  site: Site;
  url: string;
};

export type ProjectAssociation = {
  repository: Repository;
  project: Project;
};

export type CreatePrCommentIssuePayload = {
  cloudId: string;
  commentId: number;
  issueTypeId: number;
  projectId: string;
  summary: string;
  type: 'PrCommentIssue' | 'PrIssue';
};

export type SetFormErrorStatePayload = {
  commentId: number;
  failureReason: IssueCreationFailureReason;
  status: LoadingStatus;
};

export type IssueType = {
  id: number;
  name: string;
  subtask: boolean;
  iconUrl: string;
  fields?: {
    [fieldKey: string]: {
      name: string;
      required: boolean;
    };
  };
};

export type JiraIssue = {
  id: string;
  key: string;
  site: Site;
  project: Project;
  issueType: JiraIssueType;
  summary: string;
  updated?: string;
  status?: JiraIssueStatus;
  assignee?: JiraUser;
  renderedKey?: Rendered;
};

export type JiraIssueStatus = {
  name: string;
  category: string;
};

export type JiraIssueType = {
  id: string;
  name: string;
  iconUrl: string;
};

export type PrCommentJiraIssue = {
  commentId: number;
  pullRequestId: number;
  repositoryUuid: string;
  type: string;
  issue: JiraIssue;
};

type Rendered = {
  html: string;
  markup: string;
  raw: string;
  type: string;
};

export type JiraUser = {
  accountId: string;
  displayName: string;
  avatarUrls: AvatarUrls;
};

export type DevActivity = {
  dataType: DevActivityKind;
  count: number;
  open?: boolean;
  state?: 'MERGED' | 'OPEN' | 'DECLINED';
};

export type DevActivityMap = {
  [cloudId: string]: {
    [issueId: string]: DevActivity;
  };
};

export type IssueTransition = {
  id: string;
  name: string;
  hasScreen: boolean;
  isGlobal: boolean;
  isInitial: boolean;
  isAvailable: boolean;
  isConditional: boolean;
};

export type IssueTransitionFormRowData = {
  selectedIssue: PrCommentJiraIssue | undefined;
  availableIssueTransitions: IssueTransition[];
  availableIssueTransitionsFetchedStatus: LoadingStatus;
  selectedTransition: IssueTransition | undefined;
  shouldTransition: boolean;
  transitionStatus: LoadingStatus;
};

export type FilterState = {
  siteCloudId: string;
  projectIds: string[];
  issueCategories: IssueCategory[];
  textFilterQuery: string;
  assignees: string[];
  sort: Sort;
  currentPage: number;
};

export type FilterStatePartial = Partial<FilterState>;

export type ChangeFilterStateAction = {
  type: string;
  payload: FilterStatePartial;
};

export type Assignee = {
  accountId: string;
  displayName: string;
  avatarUrls: AvatarUrls;
};

export enum SORT_ORDER {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type Sort = {
  field: 'key' | 'status' | 'assignee' | 'updated';
  order: SORT_ORDER;
};
