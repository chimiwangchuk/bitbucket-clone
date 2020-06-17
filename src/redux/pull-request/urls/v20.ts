import qs from 'qs';
import escapeBbqlString from 'src/utils/escape-bbql-string';
import {
  qsDefaultOptions,
  buildCommentUrl,
  normalizeDiffParams,
  normalizeDiffStatParams,
} from './url-utils';

type MergeRequestProps = {
  owner: string;
  repoSlug: string;
  pullRequestId: string | number;
};

const baseV2Url = `/!api/2.0/repositories`;

export const v20 = {
  approval: (owner: string, repoSlug: string, pullRequestId: string | number) =>
    `${baseV2Url}/${owner}/${repoSlug}/pullrequests/${pullRequestId}/approve`,

  commentSave: buildCommentUrl,

  commentUpdate: buildCommentUrl,

  commentDelete: buildCommentUrl,

  commits: (owner: string, slug: string, id: string | number) =>
    `${baseV2Url}/${owner}/${slug}/pullrequests/${id}/commits`,
  decline: (owner: string, repoSlug: string, pullRequestId: string | number) =>
    `${baseV2Url}/${owner}/${repoSlug}/pullrequests/${pullRequestId}/decline`,

  diff: (
    user: string,
    repoSlug: string,
    pullRequestId: string | number,
    params?: {
      ignoreWhitespace?: boolean | null | undefined;
    }
  ) => {
    const url = `${baseV2Url}/${user}/${repoSlug}/pullrequests/${pullRequestId}/diff`;

    const query = params
      ? qs.stringify(normalizeDiffParams(params), qsDefaultOptions)
      : '';

    return `${url}${query}`;
  },

  diffstat: (
    user: string,
    repoSlug: string,
    pullRequestId: string | number,
    ignoreWhitespace: boolean | null | undefined
  ) => {
    const qsParams = normalizeDiffStatParams(ignoreWhitespace);
    const query = qs.stringify(qsParams, qsDefaultOptions);
    const url = `${baseV2Url}/${user}/${repoSlug}/pullrequests/${pullRequestId}/diffstat`;

    return `${url}${query}`;
  },

  merge: ({ owner, repoSlug, pullRequestId }: MergeRequestProps) =>
    `${baseV2Url}/${owner}/${repoSlug}/pullrequests/${pullRequestId}/merge`,

  participants: (
    owner: string,
    repoSlug: string,
    pullRequestId: string | number
  ) =>
    `${baseV2Url}/${owner}/${repoSlug}/pullrequests/${pullRequestId}?fields=participants`,

  pullRequests: (
    owner: string,
    repoSlug: string,
    destinationBranch: string
  ) => {
    const bbql = encodeURIComponent(
      `destination.branch.name="${escapeBbqlString(
        destinationBranch
      )}" AND state="OPEN"`
    );
    return `/!api/2.0/repositories/${owner}/${repoSlug}/pullrequests?fields=size&q=${bbql}`;
  },

  statusesFetch: (
    owner: string,
    repoSlug: string,
    pullRequestId: string | number
  ) =>
    `${baseV2Url}/${owner}/${repoSlug}/pullrequests/${pullRequestId}/statuses?pagelen=100`,
};
