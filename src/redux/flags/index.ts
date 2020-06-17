import { Action } from 'src/types/state';
import { ComponentFlagId, FlagObject, SimpleFlagProps } from './types';

export type FlagsState = FlagObject[];

// Action Types
export const DISMISS_FLAG = 'flags/DISMISS_FLAG';
export const SHOW_FLAG = 'flags/SHOW_FLAG';

type DismissFlagAction = {
  type: 'flags/DISMISS_FLAG';
  payload: { id: ComponentFlagId | string };
};

type DismissFlagActionWithoutSeenState = {
  type: 'flags/DISMISS_FLAG';
  payload: { id: ComponentFlagId | string; updateSeenState: boolean };
};

type ShowFlagAction = {
  type: 'flags/SHOW_FLAG';
  payload: { flag: FlagObject };
};

// Action Creators
export const dismissFlag = (
  flagId: ComponentFlagId | string
): DismissFlagAction => ({
  type: DISMISS_FLAG,
  payload: { id: flagId },
});

export const dismissFlagWithoutUpdatingSeenState = (
  flagId: ComponentFlagId | string
): DismissFlagActionWithoutSeenState => ({
  type: DISMISS_FLAG,
  payload: { id: flagId, updateSeenState: false },
});

export const showFlag = (flag: SimpleFlagProps): ShowFlagAction => ({
  type: SHOW_FLAG,
  payload: { flag: { ...flag, type: 'simple' } },
});

export const showFlagComponent = (id: ComponentFlagId): ShowFlagAction => ({
  type: SHOW_FLAG,
  payload: { flag: { type: 'component', id } },
});

// Reducer

const initialState: FlagsState = [];

export const reducer = (
  state: FlagsState = initialState,
  action: Action
): FlagsState => {
  switch (action.type) {
    case 'global/LOAD_SUCCESS': {
      const serverFlags = action.payload.result.flags || [];
      const flags = state.slice();

      // @ts-ignore TODO: fix noImplicitAny error here
      serverFlags.forEach(flag => {
        const flagIndex = flags.findIndex(f => f.id === flag.id);
        const flagExists = flagIndex !== -1;

        // If the flag from the server does not exist, add it
        if (!flagExists) {
          flags.push(flag);
        }

        // If the flag to be added already exists, update its content
        if (flagExists) {
          flags[flagIndex] = flag;
        }
      });

      return flags;
    }

    case SHOW_FLAG: {
      const { flag } = action.payload;
      const flags = state.slice();
      const flagIndex = flags.findIndex(f => f.id === flag.id);
      const flagExists = flagIndex !== -1;

      // If the flag to be added does not exist, add it
      if (!flagExists) {
        flags.push(flag);
      }

      // If the flag to be added already exists, update its content
      if (flagExists) {
        flags[flagIndex] = flag;
      }

      return flags;
    }

    case DISMISS_FLAG: {
      const { id } = action.payload;
      const flags = state.slice();
      const flagIndex = flags.findIndex(f => f.id === id);
      const flagExists = flagIndex !== -1;

      // If the flag to be removed doesn't exist, exit early and ignore the action
      if (!flagExists) {
        return state;
      }

      // If the flag to be removed exists, remove it
      if (flagExists) {
        flags.splice(flagIndex, 1);
      }

      return flags;
    }

    default:
      return state;
  }
};
