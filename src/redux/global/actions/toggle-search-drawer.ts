import { TOGGLE_SEARCH_DRAWER } from './';

type ToggleSearchDrawerPayload = boolean;

export type ToggleSearchDrawerAction = {
  type: 'global/TOGGLE_SEARCH_DRAWER';
  payload: ToggleSearchDrawerPayload;
};

export default (isOpen?: ToggleSearchDrawerPayload) => {
  return {
    type: TOGGLE_SEARCH_DRAWER,
    payload: isOpen,
  };
};
