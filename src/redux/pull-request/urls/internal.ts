import qs from 'qs';
import { ISO8601DateString, UrlPieces } from 'src/types/pull-request';
import { qsDefaultOptions, buildCommentUrl } from './url-utils';

const baseUrl = '!api/internal/repositories';
const DEFAULT_ACTIVITY_PAGELEN = 50;

type PaginatedUrlPieces = UrlPieces & { pagelen?: number };

export const internal = {
  activity: ({
    owner,
    slug,
    id,
    pagelen = DEFAULT_ACTIVITY_PAGELEN,
  }: PaginatedUrlPieces) => {
    const qsParams = {
      pagelen,
      fields: '+values.comment.inline.*',
    };
    const query = qs.stringify(qsParams, qsDefaultOptions);
    const url = `/${baseUrl}/${owner}/${slug}/pullrequests/${id}/activity`;

    return `${url}${query}`;
  },

  orderedCommentsFetch: (
    user: string,
    repoSlug: string,
    pullRequestId: string | number
  ) => {
    return buildCommentUrl(user, repoSlug, pullRequestId, undefined, {
      baseUrl,
      extraQueryStringParams: {
        fields: '+values.user.account_status',
        pagelen: 100,
        sort: 'created_on',
      },
    });
  },

  conflicts: (user: string, repoSlug: string, pullRequestId: string | number) =>
    `/!api/internal/repositories/${user}/${repoSlug}/pullrequests/${pullRequestId}/conflicts`,

  context: (
    pieces: {
      owner: string;
      slug: string;
      id: string | number;
      filepath: string;
    },
    lineNums: {
      startingFrom?: number;
      startingTo?: number;
      endingFrom?: number;
      endingTo?: number;
    },
    options?: {
      ignoreWhitespace?: boolean;
    }
  ) => {
    const lineNumParams = {
      nomarkup: 1,
      below_fnum: lineNums.startingFrom,
      below_tnum: lineNums.startingTo,
      above_fnum: lineNums.endingFrom,
      above_tnum: lineNums.endingTo,
      w: options && options.ignoreWhitespace ? 1 : 0,
    };
    const { owner, slug, id, filepath } = pieces;
    const url = `/!api/internal/repositories/${owner}/${slug}/pullrequests/${id}/_context/${filepath}`;

    const query = qs.stringify(lineNumParams, {
      addQueryPrefix: true,
      skipNulls: true,
    });

    return `${url}${query}`;
  },

  imageUpload: (owner: string, slug: string) =>
    `/xhr/${owner}/${slug}/image-upload/`,

  mergeChecks: (
    user: string,
    repoSlug: string,
    pullRequestId: string | number
  ) =>
    `/!api/internal/repositories/${user}/${repoSlug}/pullrequests/${pullRequestId}/merge-restrictions`,

  pendingMerge: (
    owner: string,
    repoSlug: string,
    pullRequestId: string | number
  ) =>
    `/!api/internal/repositories/${owner}/${repoSlug}/pullrequests/${pullRequestId}/pending_merge`,

  tasksFetch: (
    user: string,
    repoSlug: string,
    pullRequestId: string | number
  ) =>
    `/!api/internal/repositories/${user}/${repoSlug}/pullrequests/${pullRequestId}/tasks?pagelen=100`,

  tasks: (user: string, repoSlug: string, pullRequestId: string | number) =>
    `/!api/internal/repositories/${user}/${repoSlug}/pullrequests/${pullRequestId}/tasks`,

  task: (
    user: string,
    repoSlug: string,
    pullRequestId: string | number,
    taskId: string | number
  ) =>
    `/!api/internal/repositories/${user}/${repoSlug}/pullrequests/${pullRequestId}/tasks/${taskId}`,

  watch: (owner: string, repoSlug: string, pullRequestId: string | number) =>
    `/!api/internal/repositories/${owner}/${repoSlug}/pullrequests/${pullRequestId}/watch`,

  commentById: (
    owner: string,
    repoSlug: string,
    pullRequestId: string | number,
    commentId: string | number
  ) =>
    `/!api/internal/repositories/${owner}/${repoSlug}/pullrequests/${pullRequestId}/comments/${commentId}`,

  likeComment: (
    owner: string,
    repoSlug: string,
    pullRequestId: string | number,
    commentId: string | number
  ) =>
    `/!api/internal/repositories/${owner}/${repoSlug}/pullrequests/${pullRequestId}/comments/${commentId}/likes`,

  commentLikes: (
    owner: string,
    repoSlug: string,
    pullRequestId: string | number
  ) =>
    `/!api/internal/repositories/${owner}/${repoSlug}/pullrequests/${pullRequestId}/likes`,

  updates: (
    owner: string,
    repoSlug: string,
    pullRequestId: string | number,
    since: Date | ISO8601DateString
  ) => {
    const sinceVal = typeof since === 'string' ? since : since.toISOString();
    return `/!api/internal/repositories/${owner}/${repoSlug}/pullrequests/${pullRequestId}/updates?since=${encodeURIComponent(
      sinceVal
    )}`;
  },

  branchSyncInfo: (
    owner: string,
    repoSlug: string,
    pullRequestId: string | number
  ) =>
    `/!api/internal/repositories/${owner}/${repoSlug}/pullrequests/${pullRequestId}/branch-sync-info`,

  revert: (owner: string, repoSlug: string, pullRequestId: string | number) =>
    `/!api/internal/repositories/${owner}/${repoSlug}/pullrequests/${pullRequestId}/revert`,
};
