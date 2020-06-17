import { SidebarType } from './types';

// Action Types

export const TOGGLE_SIDEBAR = 'sidebar/TOGGLE';

type ToggleSidebarOptions = {
  isOpen?: boolean;
  width?: number;
  sidebarType: SidebarType;
};

export type ToggleSidebarAction = {
  type: 'sidebar/TOGGLE';
  payload: ToggleSidebarOptions;
};

export type SidebarAction = ToggleSidebarAction;

export const toggleSidebar = (payload: ToggleSidebarOptions) => ({
  type: TOGGLE_SIDEBAR,
  payload,
});

export const UPDATE_SIDEBAR_STATE = 'sidebar/UPDATE_STATE';

export const updateSidebarState = (payload: ToggleSidebarOptions) => ({
  type: UPDATE_SIDEBAR_STATE,
  payload,
});
