import { stringify } from 'qs';

import { createAsyncAction, fetchAction } from 'src/redux/actions';
import { pullRequest } from 'src/redux/pull-request/schemas';

type LoadProps = {
  repositoryOwner: string;
  repositorySlug: string;
  bbql: string;
  page: number;
};

export const LoadPullRequests = createAsyncAction('pullRequestList/LOAD');
export const loadPullRequests = (props: LoadProps) => {
  const { repositoryOwner, repositorySlug, page } = props;
  const query = stringify({
    pagelen: 25,
    fields: '+values.participants',
    q: props.bbql,
    page,
  });
  const url = `/!api/2.0/repositories/${repositoryOwner}/${repositorySlug}/pullrequests?${query}`;
  const schema = { values: [pullRequest] };

  return fetchAction(LoadPullRequests, { url, schema, takeLatest: true });
};

export const LoadNextPage = 'pullRequestList/loadNextPage';
export const LoadPreviousPage = 'pullRequestList/loadPreviousPage';
export const PageUnload = 'pullRequestList/PageUnload';

export const pageUnload = () => ({ type: PageUnload });

export const UnloadPullRequests = 'pullRequestList/UNLOAD';
export const unloadPullRequests = () => ({
  type: UnloadPullRequests,
});

export * from './pull-request-authors';
