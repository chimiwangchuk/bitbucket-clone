import { ChunkEntry } from '@atlassian/bitkit-diff';
import { Link } from 'src/components/types';
import { DiffStatStatus } from './diffstat';

/* Ex. 2019-10-29T02:09:00.251619+00:00 */
export type ISO8601DateString = string;

export type PullRequestUpdatesError = { error: true };

export type CommonEvent = {
  evt: {
    url: string | null;
    reference_id: string | null;
  };
  time: ISO8601DateString;
  user: {
    account_id: unknown;
    display_name: string | null;
    links: {
      avatar: Link;
      html: Link;
      self: Link;
    };
    nickname: string | null;
    type: 'user';
    username: string | null;
    uuid: string;
  };
  utc_time: string;
};

export type CommentAddedEvent = CommonEvent & {
  comment: {
    anchor: unknown;
    comment_id: number;
    comparespec: string;
    content: string;
    content_rendered: string;
    convert_markup: boolean;
    deleted: boolean;
    dest_rev: string | null;
    display_name: string | null;
    filename: string | null;
    filename_hash: string | null;
    is_entity_author: boolean;
    is_repo_owner: boolean;
    is_spam: boolean;
    line_from: unknown;
    line_to: unknown;
    parent_id: unknown;
    pr_repo: { owner: string; slug: string };
    pull_request_id: number;
    user_avatar_url: string;
    user_avatar_url_2x: string;
    username: string | null;
    utc_created_on: string;
    utc_last_updated: string;
  };
};
export type ApprovalAddedEvent = CommonEvent;

export type PullRequestUpdatesResponse = {
  anchorMoved: boolean;
  approvalsAdded: ApprovalAddedEvent[];
  approvalsRemoved: any[];
  commentsAdded: CommentAddedEvent[];
  commentsDeleted: any[];
  commentsEdited: any[];
  commentsReplied: any[];
  destRevMoved: boolean;
  lastModified: ISO8601DateString;
  prDetailsModified: boolean;
  viewers: any[];
  links?: { diff: Link; diffstat: Link };
};

export type Diff = {
  from: string;
  to: string;
  headers: string[];
  chunks: ChunkEntry[];
  fileDiffStatus?: DiffStatStatus;
  conflictMessage?: string;
  isConflicted?: boolean;
  isFileContentsUnchanged?: boolean;
  isBinary: boolean;
  isImage: boolean;
  deletions: number;
  additions: number;
  index: string[];
  deleted?: boolean;
  // Unused field returned by diffparser
  new?: boolean;
};

export type UrlPieces = {
  owner: string;
  slug: string;
  id: string | number;
};

export type PRLocator = {
  owner: string;
  ownerUuid?: string | undefined;
  slug: string;
  repoUuid?: string | undefined;
  id: number | undefined;
};

export enum MergeStrategy {
  MergeCommit = 'merge_commit',
  Squash = 'squash',
  FastForward = 'fast_forward',
}

export type MergeInfo = {
  closeSourceBranch?: boolean;
  mergeStrategy?: MergeStrategy;
  message?: string;
};

export type MergeForm = {
  closeSourceBranch?: boolean;
  mergeStrategy?: MergeStrategy;
  message: string;
};

export type PullRequestFetchProps = {
  owner: string;
  repoSlug: string;
  pullRequestId: number;
};
