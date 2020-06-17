import { createResource } from '@atlaskit/router';

import { hydrateAction as hydrateActionCreator } from 'src/redux/actions';

import { Dispatch } from 'src/types/state';
import { user } from 'src/sections/profile/schemas';
import { LoadGlobal } from '../actions';

import { getHydrateAction } from '../../../middleware/hydrate';
import { stateKey, url } from '../actions/load-global';
import { ResourceContext } from '../../../router/types';

/**
 * Resource for the load-global action.
 *
 * @see src/redux/global/actions/load-global.ts
 */
export const loadGlobalResource = createResource({
  type: 'global',
  getKey: () => 'global',
  maxAge: Infinity,
  getData: async (
    _routerStoreContext,
    { reduxStore, csrftoken }: ResourceContext
  ) => {
    const { dispatch } = reduxStore as { dispatch: Dispatch };
    const action = hydrateActionCreator(LoadGlobal, stateKey, {
      url,
      isRouterResource: true,
      csrftoken,
      schema: {
        currentUser: user,
        targetUser: user,
      },
    });

    // check the initialstate before requesting anything
    const hydrateAction = getHydrateAction(action, stateKey);

    await dispatch(hydrateAction);

    return { success: true };
  },
});
