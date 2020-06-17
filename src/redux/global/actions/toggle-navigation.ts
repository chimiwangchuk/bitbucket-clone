import { TOGGLE_NAVIGATION_INIT } from './';

export type ToggleNavigationPayload = boolean;

export type ToggleNavigationAction = {
  type: 'global/TOGGLE_NAVIGATION';
  payload: ToggleNavigationPayload;
};

export default (isOpen?: ToggleNavigationPayload) => {
  return {
    type: TOGGLE_NAVIGATION_INIT,
    payload: isOpen,
  };
};
