import qs from 'qs';

export const qsDefaultOptions = {
  addQueryPrefix: true,
  skipNulls: true,
};

type CommentUrlOptions = {
  baseUrl?: string;
  extraQueryStringParams?: object;
};

const BASE_URL = '!api/2.0/repositories';

const DEFAULT_OPTIONS: CommentUrlOptions = {
  baseUrl: BASE_URL,
  extraQueryStringParams: {},
};

// IMPORTANT: NUM_INITIAL_CONTEXT_LINES MUST BE AT LEAST 1
// OTHERWISE CONTEXT EXPANSION WILL BREAK.
const NUM_INITIAL_CONTEXT_LINES = 3;

export function buildCommentUrl(
  user: string,
  repoSlug: string,
  pullRequestId: string | number,
  commentId: number | string = '',
  options: CommentUrlOptions = DEFAULT_OPTIONS
) {
  const { baseUrl, extraQueryStringParams } = options;

  const query = qs.stringify(
    {
      ...extraQueryStringParams,
    },
    qsDefaultOptions
  );

  const base = baseUrl || BASE_URL;
  const url = `/${base}/${user}/${repoSlug}/pullrequests/${pullRequestId}/comments/${commentId}`;

  return `${url}${query}`;
}

export const normalizeDiffParams = (params: {
  ignoreWhitespace?: boolean | null | undefined;
}) => ({
  binary: false,
  context: NUM_INITIAL_CONTEXT_LINES,
  ignore_whitespace: params.ignoreWhitespace || null,
});

export const normalizeDiffStatParams = (
  ignoreWhitespace: boolean | null | undefined
) => ({
  ignore_whitespace: ignoreWhitespace || null,
  pagelen: 200,
});

export function getUrlPieces(url: string) {
  const queryStart = url.indexOf('?');
  if (queryStart === -1) {
    return { location: url, params: {} };
  }

  const query = url.substring(queryStart);
  const location = url.substring(0, queryStart);

  return {
    location,
    params: qs.parse(query, { ignoreQueryPrefix: true }),
  };
}

export function addQueryParams(url: string, params: object) {
  const { location, params: oldParams } = getUrlPieces(url);
  const newParams = {
    ...oldParams,
    ...params,
  };
  const query = qs.stringify(newParams, qsDefaultOptions);
  return `${location}${query}`;
}
