import { fetchAction } from 'src/redux/actions';
import urls from 'src/redux/pull-request/urls';

import { FETCH_TASKS } from './constants';

type FetchTasksOptions = {
  owner: string;
  repoSlug: string;
  pullRequestId: number;
};

export default ({ owner, repoSlug, pullRequestId }: FetchTasksOptions) =>
  fetchAction(FETCH_TASKS, {
    url: urls.api.internal.tasksFetch(owner, repoSlug, pullRequestId),
  });
