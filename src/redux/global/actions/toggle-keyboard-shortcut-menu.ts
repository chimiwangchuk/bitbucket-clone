import { TOGGLE_KB_SHORTCUT_MENU } from './';

export type ToggleKeyboardShortcutMenuAction = {
  type: 'global/TOGGLE_KB_SHORTCUT_MENU';
  payload: boolean;
};

export default (payload?: boolean) => {
  return {
    type: TOGGLE_KB_SHORTCUT_MENU,
    payload,
  };
};
