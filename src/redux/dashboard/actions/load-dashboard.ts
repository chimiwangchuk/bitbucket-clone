import { hydrateAction } from 'src/redux/actions';
import urls from 'src/urls/dashboard';

import { LoadDashboard } from './';

export const stateKey = ['dashboard.section', 'section.dashboard'];
export default () =>
  hydrateAction(LoadDashboard, stateKey, {
    url: urls.ui.root(),
  });
