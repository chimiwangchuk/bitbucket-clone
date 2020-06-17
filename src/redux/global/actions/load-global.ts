import { hydrateAction } from 'src/redux/actions';

import { user } from 'src/sections/profile/schemas';

import { LoadGlobal } from './';

// XXX this is a hack to use the `state=section` query paramter
// But it's okay because this should go away soon anyways
export const stateKey = ['global', 'section.global'];
export const url = '/';
export default () =>
  hydrateAction(LoadGlobal, stateKey, {
    url,
    schema: {
      currentUser: user,
      targetUser: user,
    },
  });
