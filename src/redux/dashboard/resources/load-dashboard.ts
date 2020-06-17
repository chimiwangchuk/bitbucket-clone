import { createResource } from '@atlaskit/router';

import { hydrateAction as hydrateActionCreator } from 'src/redux/actions';
import urls from 'src/urls/dashboard';

import { Dispatch } from 'src/types/state';
import { LoadDashboard } from '../actions';

import { getHydrateAction } from '../../../middleware/hydrate';
import { stateKey as dashboardActionStateKey } from '../actions/load-dashboard';
import { fetchData } from '../../../router/utils/fetch';
import { urlWithState } from '../../../utils/state-key';
import { ResourceContext } from '../../../router/types';

export const getLoadDashboardResource = (maxAge = 0) =>
  createResource({
    type: 'dashboard',
    getKey: () => 'dashboard',
    maxAge,
    getData: async (
      _routerStoreContext,
      { reduxStore, csrftoken }: ResourceContext
    ) => {
      const { dispatch } = reduxStore as { dispatch: Dispatch };
      const requestUrl = urls.ui.root();
      const action = hydrateActionCreator(
        LoadDashboard,
        dashboardActionStateKey,
        {
          url: requestUrl,
          isRouterResource: true,
          csrftoken,
        }
      );

      // check the initialstate before requesting anything
      const hydrateAction = getHydrateAction(action, dashboardActionStateKey);
      if (hydrateAction) {
        // we have something from the window, return it and bail
        dispatch(hydrateAction);

        return { status: 'success' };
      }

      action.meta.url = urlWithState(requestUrl, dashboardActionStateKey);

      dispatch(action);

      await dispatch(fetchData(action));

      return { status: 'success' };
    },
  });
