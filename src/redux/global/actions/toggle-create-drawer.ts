import { TOGGLE_CREATE_DRAWER } from './';

type ToggleCreateDrawerPayload = boolean;

export type ToggleCreateDrawerAction = {
  type: 'global/TOGGLE_CREATE_DRAWER';
  payload: ToggleCreateDrawerPayload;
};

export default (isOpen: ToggleCreateDrawerPayload) => {
  return {
    type: TOGGLE_CREATE_DRAWER,
    payload: isOpen,
  };
};
