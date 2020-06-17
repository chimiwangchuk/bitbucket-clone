import { Link } from 'src/components/types';
import { ISO8601DateString } from 'src/types/pull-request';
import { FabricConversation } from '../conversation-provider/types';

export enum ActivityEntryTypes {
  CommentStart = 'comment-start',
  CommentReplies = 'comment-replies',
  TaskCreated = 'task-created',
  TaskResolved = 'task-resolved',
  Commit = 'update',
  StatusChange = 'status-change',
  Approval = 'approval',
}

export type CommentStartEntry = {
  readonly type: 'comment-start';
  actor: BB.User;
  event: FabricConversation;
  timestamp: Date;
};

export type CommentRepliesEntry = {
  readonly type: 'comment-replies';
  actor: BB.User;
  event: FabricConversation;
  numOfReplies: number;
  timestamp: Date;
};

export type TitleChangeEntry = {
  readonly type: 'title-change';
  actor: ApiUserField;
  event: Update;
  lastTitle: string;
  timestamp: Date;
};

export type DescriptionChangeEntry = {
  readonly type: 'description-change';
  actor: ApiUserField;
  event: Update;
  timestamp: Date;
};

export type ReviewersAddedEntry = {
  readonly type: 'reviewers-added';
  actor: ApiUserField;
  event: Update;
  timestamp: Date;
};

export type CommitEntryHashItem = {
  hash: string | null;
  url: string | null;
};

export type CommitEntry = {
  readonly type: 'update';
  actor: ApiUserField;
  event: Update;
  hashes: CommitEntryHashItem[];
  timestamp: Date;
};

export const isCommitEntry = (entry: any): entry is CommitEntry => {
  return (
    entry && 'type' in entry && entry.type === 'update' && 'hashes' in entry
  );
};

export type StatusChangeEntry = {
  readonly type: 'status-change';
  actor: ApiUserField;
  event: Update;
  timestamp: Date;
};

export type ApprovalEntry = {
  readonly type: 'approval';
  actor: ApiUserField;
  event: Approval;
  timestamp: Date;
};

export type TaskCreatedEntry = {
  readonly type: 'task-created';
  actor: ApiUserField;
  event: TaskActivity;
  timestamp: Date;
};

export type TaskResolvedEntry = {
  readonly type: 'task-resolved';
  actor: ApiUserField;
  event: TaskActivity;
  timestamp: Date;
};

// Structures for React component consumption
export type ActivityEntry =
  | ApprovalEntry
  | StatusChangeEntry
  | CommitEntry
  | DescriptionChangeEntry
  | TitleChangeEntry
  | ReviewersAddedEntry
  | CommentStartEntry
  | CommentRepliesEntry
  | TaskCreatedEntry
  | TaskResolvedEntry;

// Has all the required fields of our BB.User but should
// also have html link and account_id.
type ApiUserField = BB.User & {
  account_id: string;
  links: { html: Link };
};

type ApiCommitField = {
  commit: {
    type: 'commit';
    hash: string;
    links: {
      self: Link;
      html: Link;
    };
  } | null;
  branch: {
    name: string;
  };
  repository: {
    name: string;
    type: 'repository';
    full_name: string;
    links: {
      self: Link;
      html: Link;
      avatar: Link;
    };
    uuid: string;
  } | null;
};

type Update = {
  update: {
    description: string;
    title: string;
    destination: ApiCommitField;
    reason: string;
    source: ApiCommitField;
    state: BB.PullRequestState;
    // the html link should be there in this response
    author: ApiUserField;
    date: ISO8601DateString;
    changes: {
      title?: {
        old: string;
        new: string;
      };
      description?: {
        old: string;
        new: string;
      };
      status?: {
        old: string;
        new: string;
      };
      reviewers?: {
        added?: ApiUserField[];
        removed?: ApiUserField[];
      };
    };
  };
  pull_request: ApiPullRequestField;
};

type Comment = {
  comment: {
    content: {
      raw: string;
      // Not sure if this is an enumeration?
      markup: 'markdown' | string;
      html: string;
      // Not sure if this is an enumeration?
      type: 'rendered' | string;
    };
    created_on: ISO8601DateString;
    deleted: boolean;
    id: number;
    links: {
      self: Link;
      html: Link;
    };
    parent?: {
      id: number;
      links: {
        self: Link;
        html: Link;
      };
    };
    pullrequest: ApiPullRequestField;
    type: 'pullrequest_comment';
    updated_on: ISO8601DateString;
    user: ApiUserField;
  };
  pull_request: ApiPullRequestField;
};

type ApiPullRequestField = {
  type: 'pullrequest';
  id: number;
  links: {
    self: Link;
    html: Link;
  };
  title: string;
};

type Approval = {
  approval: {
    date: ISO8601DateString;
    pullrequest: ApiPullRequestField;
    user: ApiUserField;
  };
  pull_request: ApiPullRequestField;
};

type TaskActivity = {
  task: {
    id: number;
    actor: ApiUserField;
    action: string;
    action_on: ISO8601DateString;
    task: BB.Task;
  };
  pull_request: ApiPullRequestField;
};

export interface ActivityApi {
  Comment: Comment;
  Approval: Approval;
  Update: Update;
  TaskActivity: TaskActivity;
}

export type ActivityApiResponse = ActivityApi[keyof ActivityApi];

export const isUpdateActivity = (item: ActivityApiResponse): item is Update => {
  return 'update' in item;
};

export const isApprovalActivity = (
  item: ActivityApiResponse
): item is Approval => {
  return 'approval' in item;
};

export const isTaskActivity = (
  item: ActivityApiResponse
): item is TaskActivity => {
  return 'task' in item;
};

export const isNotCommentActivity = (
  item: ActivityApiResponse
): item is Approval | Update | TaskActivity => {
  return !('comment' in item);
};
