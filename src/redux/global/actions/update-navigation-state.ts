import { ToggleNavigationPayload } from './toggle-navigation';
import { UPDATE_NAVIGATION_STATE } from './';

export default (payload?: ToggleNavigationPayload) => ({
  type: UPDATE_NAVIGATION_STATE,
  payload,
});
