import { TOGGLE_ATLASSIAN_SWITCHER } from './';

export default (isOpen: boolean) => {
  return {
    type: TOGGLE_ATLASSIAN_SWITCHER,
    payload: isOpen,
  };
};
