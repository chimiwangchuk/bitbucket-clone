import { User, Link } from 'src/components/types';

export type InlineField = {
  from: number | null;
  to: number | null;
  path?: string | null | undefined;
  outdated?: boolean;
  context_lines?: string;
};

export type ADF = {
  version: 1;
  type: 'doc';
  content: any[];
};

export type FabricUser = {
  id: string | null;
  name: string;
  avatarUrl?: string;
  profileUrl?: string;
};

export type FabricComment = {
  commentId: number;
  localId: number;
  conversationId: string;
  parentId?: string | number;
  document: {
    adf?: ADF;
  };
  createdBy: FabricUser;
  createdAt: string;
  deleted?: boolean;
};

export type ApiCommentPR = {
  id: number;
  links: {
    href: Link;
    self: Link;
  };
  title: string;
  type: string;
};

export type ApiComment = {
  content: { raw: string; markup: string; html: string; type: string };
  created_on: string;
  deleted: boolean;
  id: number;
  inline?: InlineField;
  links: { href: Link; self: Link };
  parent?: {
    id: number;
  };
  pullrequest: ApiCommentPR;
  type: string;
  updated_on: string;
  user: User;
};

export type ApiCommentLikes = {
  comment_id: number;
  users: User[];
};

export type CommentLikes = {
  commentId: number | string;
  users: User[];
};

// Helper type for narrowing access
type FilePathComment = ApiComment & {
  inline: {
    path: string;
  };
};
// Helper to narrow access to comment fields
export const isFileComment = (c: ApiComment): c is FilePathComment => {
  return !!c.inline && !!c.inline.path;
};

export type MinimalCodeReviewConversationComment = {
  id: number;
  permalink: string;
  authorUuid: string | null;
};

export type CodeReviewConversation = {
  conversationId: string;
  meta: InlineField;
  numOfComments: number;
  createdAt: string;
  createdBy: FabricUser;
  comments: MinimalCodeReviewConversationComment[];
};

export type FabricConversation = {
  conversationId: string;
  containerId: string;
  localId?: string;
  comments: FabricComment[];
  meta: InlineField;
  createdAt: string;
};

export type ProviderUrls = {
  commentSave: () => string;
  commentUpdate: (commentId: string | number) => string;
  commentDelete: (commentId: string | number) => string;
};

export type ProviderConfig = {
  anchor?: string;
  destRev?: string;
  user: FabricUser | User;
  urls: ProviderUrls;
  onAddComment: (comment: ApiComment) => void;
  onDeleteComment: (comment: { id: string }) => void;
};
