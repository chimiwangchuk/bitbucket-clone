import { createAsyncAction } from 'src/redux/actions';

import { SearchAction } from './search';
import { ToggleCreateDrawerAction } from './toggle-create-drawer';
import { ToggleKeyboardShortcutMenuAction } from './toggle-keyboard-shortcut-menu';
import { ToggleNavigationAction } from './toggle-navigation';
import { ToggleSearchDrawerAction } from './toggle-search-drawer';

export type GlobalAction =
  | SearchAction
  | ToggleCreateDrawerAction
  | ToggleKeyboardShortcutMenuAction
  | ToggleNavigationAction
  | ToggleSearchDrawerAction;

export type MobileHeaderState = 'none' | 'navigation' | 'sidebar';

export const HYDRATE_FROM_LOCALSTORAGE = 'global/HYDRATE_FROM_LOCALSTORAGE';

export const TOGGLE_CREATE_DRAWER = 'global/TOGGLE_CREATE_DRAWER';
export const TOGGLE_KB_SHORTCUT_MENU = 'global/TOGGLE_KB_SHORTCUT_MENU';
export const TOGGLE_NAVIGATION_INIT = 'global/TOGGLE_NAVIGATION_INIT';
export const TOGGLE_NAVIGATION = 'global/TOGGLE_NAVIGATION';
export const TOGGLE_MOBILE_HEADER = 'global/TOGGLE_MOBILE_HEADER';
export const TOGGLE_SEARCH_DRAWER = 'global/TOGGLE_SEARCH_DRAWER';
export const TOGGLE_ATLASSIAN_SWITCHER = 'global/TOGGLE_ATLASSIAN_SWITCHER';

export const UPDATE_MOBILE_HEADER_STATE = 'global/UPDATE_MOBILE_HEADER_STATE';
export const UPDATE_NAVIGATION_STATE = 'global/UPDATE_NAVIGATION_STATE';

export const TOGGLE_UP_TO_SMALL_BREAKPOINT =
  'global/TOGGLE_UP_TO_SMALL_BREAKPOINT';

export const TOGGLE_MARKETING_CONSENT_NEEDED =
  'global/TOGGLE_MARKETING_CONSENT_NEEDED';

export const LoadGlobal = createAsyncAction('global/LOAD');
export const LoadPullRequests = createAsyncAction('global/LOAD_PULL_REQUESTS');
export const LoadRepositories = createAsyncAction('global/LOAD_REPOSITORIES');
export const LoadIssues = createAsyncAction('global/LOAD_ISSUES');
export const SEARCH = 'global/SEARCH';
export const SEARCH_DRAWER_INIT = 'global/SEARCH_DRAWER_INIT';

export const SCROLL_TO = 'global/SCROLL_TO';

export const NETWORK_OFFLINE = 'global/NETWORK_OFFLINE';
export const NETWORK_ONLINE = 'global/NETWORK_ONLINE';

// Used for overriding features in tests.
export const OVERRIDE_FEATURE = 'global/OVERRIDE_FEATURE';
