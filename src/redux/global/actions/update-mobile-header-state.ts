import { UPDATE_MOBILE_HEADER_STATE, MobileHeaderState } from './';

export default (nextState: MobileHeaderState) => ({
  type: UPDATE_MOBILE_HEADER_STATE,
  payload: nextState,
});
