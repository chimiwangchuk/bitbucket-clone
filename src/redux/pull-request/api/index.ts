/* eslint-disable no-use-before-define, @typescript-eslint/no-use-before-define */
import { Left, Right, Either } from 'funfix-core';
import urls from 'src/redux/pull-request/urls';
import authRequest, { jsonHeaders } from 'src/utils/fetch';
import { HttpMethods, Watch } from 'src/components/types';
import {
  PullRequestUpdatesError,
  PullRequestUpdatesResponse,
} from 'src/types/pull-request';
import { HttpError } from 'src/components/types/src/http-methods';
import { CodeReviewConversation } from 'src/components/conversation-provider/types';
import { BranchSyncInfo } from 'src/redux/pull-request/types';

export type ApiType<T> = (
  owner: string,
  slug: string,
  id: string | number
) => Promise<T>;

export type WatchApiType = ApiType<Either<HttpError, Watch>>;
export type CommentByIdApiType = typeof getCommentById;

export type ApiShape = {
  getUpdates: typeof getUpdates;
  getPullRequest: typeof getPullRequest;
  getDiffStat: typeof getDiffStat;
  getDiff: typeof getDiff;
  getCommentLikes: typeof getCommentLikes;
  getConflicts: typeof getConflicts;
  getActivity: typeof getActivity;
  getWatch: typeof getWatch;
  startWatch: typeof startWatch;
  stopWatch: typeof stopWatch;
  getCommentById: typeof getCommentById;
  getMergeChecks: typeof getMergeChecks;
  getCommits: typeof getCommits;
  getStackedPullRequestsCount: typeof getStackedPullRequestsCount;
  getBranchSyncInfo: typeof getBranchSyncInfo;
};

type CommitsResponse = {
  commits: BB.Commit[];
  next?: string;
  page: number;
  pagelen: number;
};

type GenericError = {
  error: boolean;
  status?: number;
};

export const getBranchSyncInfo = async (
  owner: string,
  slug: string,
  pullRequestId: string | number
): Promise<BranchSyncInfo | GenericError> => {
  try {
    const url = urls.api.internal.branchSyncInfo(owner, slug, pullRequestId);
    const response = await fetch(authRequest(url));
    if (response.ok) {
      return response.json();
    } else {
      return {
        error: true,
        status: response.status,
      };
    }
  } catch (e) {
    return {
      error: true,
    };
  }
};

export const getCommits = async (
  url: string
): Promise<CommitsResponse | GenericError> => {
  try {
    const response = await fetch(authRequest(url));

    if (response.ok) {
      const { page, pagelen, next, values: commits } = await response.json();
      return { commits, next, page, pagelen };
    } else {
      return {
        error: true,
        status: response.status,
      };
    }
  } catch (e) {
    return {
      error: true,
    };
  }
};

export const getCommentById = async (
  owner: string,
  slug: string,
  pullRequestId: string | number,
  commentId: string | number
): Promise<CodeReviewConversation | HttpError> => {
  const response = await fetch(
    authRequest(
      urls.api.internal.commentById(owner, slug, pullRequestId, commentId),
      {
        method: HttpMethods.get,
      }
    )
  );
  const result = await response.json();
  if (!response.ok) {
    const error: HttpError = {
      msg: `An error occurred while fetching a comment with id ${commentId}`,
      status: response.status,
    };
    return error;
  }
  return result;
};

export const getUpdates = async (
  ...args: ArgumentsOf<typeof urls.api.internal.updates>
): Promise<PullRequestUpdatesResponse | PullRequestUpdatesError> => {
  const url = urls.api.internal.updates(...args);
  try {
    const resp = await fetch(authRequest(url));
    const json = await resp.json();
    return json;
  } catch (e) {
    return { error: true };
  }
};

export const getWatch = (owner: string, slug: string, id: string | number) =>
  watch(
    owner,
    slug,
    id,
    HttpMethods.get,
    'An error occurred while fetching watch status.'
  );

export const startWatch = (owner: string, slug: string, id: string | number) =>
  watch(
    owner,
    slug,
    id,
    HttpMethods.post,
    'An error occurred while trying to watch.'
  );

export const stopWatch = (owner: string, slug: string, id: string | number) =>
  watch(
    owner,
    slug,
    id,
    HttpMethods.delete,
    'An error occurred while trying to stop watching.'
  );

export const watch = async (
  owner: string,
  slug: string,
  id: string | number,
  method: HttpMethods,
  errorMsg: string
) => {
  const response = await fetch(
    authRequest(urls.api.internal.watch(owner, slug, id), { method })
  );
  const result: Watch = await response.json();
  if (!response.ok) {
    const error: HttpError = {
      status: response.status,
      msg: errorMsg,
    };
    return Left(error);
  }
  return Right(result);
};

const IdentityFunction = (a: any) => a;

const createPullRequestFetch = (
  url: (owner: string, slug: string, id: string | number) => string,
  valueExtractor: (value: any) => any = IdentityFunction,
  errorExtractor: (value: any) => any = IdentityFunction
) => {
  return async (owner: string, slug: string, id: string | number) => {
    const response = await fetch(authRequest(url(owner, slug, id)), {
      headers: jsonHeaders,
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(errorExtractor(json.error.message));
    }

    return valueExtractor(json);
  };
};

export const getCommentLikes = async (url: string) => {
  const response = await fetch(authRequest(url));
  if (!response.ok) {
    const error = new Error(
      'An error occurred while fetching the comment likes.'
    );
    // @ts-ignore
    error.status = response.status;
    throw error;
  }
  const json = await response.json();
  return json;
};

export const getDiff = async (url: string) => {
  const response = await fetch(authRequest(url));
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the diff.');
    // @ts-ignore
    error.status = response.status;
    throw error;
  }
  return response.text();
};

export const getActivity = async (url: string) => {
  const response = await fetch(authRequest(url));

  if (!response.ok) {
    const error = new Error(
      'An error ocurred while fetching the pull request activity.'
    );
    // @ts-ignore
    error.status = response.status;
    // The error message being displayed to the user is translated.
    error.message = `Couldn't load content`;
    throw error;
  }

  const json = await response.json();

  return json;
};

// @ts-ignore TODO: fix noImplicitAny error here
export const getMergeChecks = async url => {
  const response = await fetch(authRequest(url));

  if (!response.ok) {
    const error = new Error(
      'An error ocurred while fetching the merge checks.'
    );
    // @ts-ignore
    error.status = response.status;
    // The error message being displayed to the user is translated.
    error.message = `Couldn't load content`;
    throw error;
  }

  const json = await response.json();

  return json;
};

export const getPullRequest = createPullRequestFetch(urls.ui.pullrequestdata);

export const getConflicts = createPullRequestFetch(urls.api.internal.conflicts);

export const getDiffStat = async (url: string) => {
  const response = await fetch(authRequest(url), {
    headers: jsonHeaders,
  });

  const result = await response.json();
  if (!response.ok) {
    const error = new Error(result.error.message);
    // @ts-ignore
    error.status = response.status;
    throw error;
  }

  return result;
};

export const getStackedPullRequestsCount = async (
  owner: string,
  slug: string,
  destinationBranch: string
) => {
  const url = urls.api.v20.pullRequests(owner, slug, destinationBranch);
  const response = await fetch(authRequest(url));
  if (!response.ok) {
    const error = new Error(
      'An error occurred while fetching stacked pull requests.'
    );
    // @ts-ignore
    error.status = response.status;
    throw error;
  }
  const json = await response.json();
  return json.size;
};
