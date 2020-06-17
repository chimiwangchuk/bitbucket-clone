import { createResource } from '@atlaskit/router';
import { Dispatch } from '../../../types/state';
import fetchRepositoriesActionCreator from '../actions/fetch-repositories';
import { fetchData } from '../../../router/utils/fetch';
import { NUM_REPOS } from '../../../sections/dashboard/sections/repositories/components';
import { ResourceContext } from '../../../router/types';

export const loadDashboardRepositoriesResource = createResource({
  type: 'dashboard',
  getKey: () => 'repositories',
  maxAge: 0,
  getData: async ({ query }, { reduxStore, csrftoken }: ResourceContext) => {
    const { dispatch } = reduxStore as { dispatch: Dispatch };
    const { projectKey, projectOwner } = query;
    const project =
      !!projectKey && !!projectOwner
        ? { owner: projectOwner, key: projectKey }
        : null;

    const queryOptions = {
      page: parseInt(query.page, 10) || 1,
      search: query.search || null,
      isWatching: !!query.watching,
      sort: query.sort || null,
      project,
      owner: query.owner || null,
      scm: query.scm || null,
    };

    const { page, sort, ...filters } = queryOptions;
    const action = fetchRepositoriesActionCreator({
      pagelen: NUM_REPOS,
      page,
      // @ts-ignore
      filters,
      // @ts-ignore
      sort,
      csrftoken,
    });

    action.meta.isRouterResource = true;

    dispatch(action);

    await dispatch(fetchData(action));

    return { status: 'success' };
  },
});
