import { Action } from 'src/types/state';

export type KeyboardShortcutReference = {
  id: string;
  // Description used for the shortcut in the help menu (shortcut hidden if not present)
  description?: string;
  // Controls whether or not the shorcut is enabled while a form field is focused
  enableInFormFields?: boolean;
  keys: string[] | string;
};

export type KeyboardShortcutGroup = {
  groupId: string;
  groupTitle?: string;
  groupWeight?: number;
  shortcuts: KeyboardShortcutReference[];
};

// Action Types
const REGISTER_SHORTCUTS = 'keyboard/REGISTER_SHORTCUTS';
const UNREGISTER_SHORTCUTS = 'keyboard/UNREGISTER_SHORTCUTS';

type RegisterShortcutsAction = {
  type: 'keyboard/REGISTER_SHORTCUTS';
  payload: KeyboardShortcutGroup;
};

type UnRegisterShortcutsAction = {
  type: 'keyboard/UNREGISTER_SHORTCUTS';
  payload: string;
};

// Action Creators
export const registerShortcuts = (
  group: KeyboardShortcutGroup
): RegisterShortcutsAction => ({
  type: REGISTER_SHORTCUTS,
  payload: group,
});

export const unRegisterShortcuts = (
  groupId: string
): UnRegisterShortcutsAction => ({
  type: UNREGISTER_SHORTCUTS,
  payload: groupId,
});

// Reducer
export type KeyboardShortcuts = {
  [groupId: string]: {
    groupTitle?: string;
    groupWeight?: number;
    shortcuts: KeyboardShortcutReference[];
  };
};

const initialState: KeyboardShortcuts = {};

export const reducer = (
  state: KeyboardShortcuts = initialState,
  action: Action
): KeyboardShortcuts => {
  switch (action.type) {
    case REGISTER_SHORTCUTS: {
      const { groupId, groupTitle, groupWeight, shortcuts } = action.payload;
      return {
        ...state,
        [groupId]: {
          groupTitle,
          groupWeight,
          shortcuts,
        },
      };
    }

    case UNREGISTER_SHORTCUTS: {
      const groupId = action.payload;

      if (!state[groupId]) {
        return state;
      }

      const newState = { ...state };
      delete newState[groupId];

      return newState;
    }

    default:
      return state;
  }
};
