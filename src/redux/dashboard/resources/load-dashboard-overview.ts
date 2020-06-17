import { createResource } from '@atlaskit/router';

import { hydrateAction as hydrateActionCreator } from 'src/redux/actions';
import urls from 'src/urls/dashboard';
import { repository } from 'src/sections/repository/schemas';
import { pullRequest } from 'src/redux/pull-request/schemas';

import { LoadDashboardOverview } from '../actions';
import { Dispatch } from '../../../types/state';
import { getHydrateAction } from '../../../middleware/hydrate';
import { fetchData } from '../../../router/utils/fetch';
import { urlWithState } from '../../../utils/state-key';
import { ResourceContext } from '../../../router/types';

const dashboardOverviewActionStateKey = 'dashboard.overview';

export const getLoadDashboardOverviewResource = (maxAge = 0) =>
  createResource({
    type: 'dashboard',
    getKey: () => 'overview',
    maxAge,
    getData: async (
      _routerStoreContext,
      { reduxStore, csrftoken }: ResourceContext
    ) => {
      const { dispatch } = reduxStore as { dispatch: Dispatch };
      const requestUrl = urls.ui.overview();
      const action = hydrateActionCreator(
        LoadDashboardOverview,
        dashboardOverviewActionStateKey,
        {
          url: requestUrl,
          isRouterResource: true,
          csrftoken,
          schema: {
            pullRequests: {
              authored: [pullRequest],
              reviewing: [pullRequest],
            },
            repositories: [repository],
          },
        }
      );

      // check the initialstate before requesting anything
      const hydrateAction = getHydrateAction(
        action,
        dashboardOverviewActionStateKey
      );
      if (hydrateAction) {
        // we have something from the window, return it and bail
        dispatch(hydrateAction);

        return { status: 'success' };
      }

      action.meta.url = urlWithState(
        requestUrl,
        dashboardOverviewActionStateKey
      );

      dispatch(action);

      await dispatch(fetchData(action));

      return { status: 'success' };
    },
  });
