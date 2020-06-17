import { Team, Issue } from 'src/components/types';
import { Action } from 'src/types/state';

import {
  FetchUserEmails,
  LoadRepositoryPage,
} from 'src/sections/repository/actions';
import {
  MenuItem,
  PullRequestGlobalSearchResult,
  RepositoryGlobalSearchResult,
} from '@atlassian/bitbucket-navigation';
import { SiteMessage } from 'src/types/site-message';
import detectMsie11 from 'src/utils/detect-msie11';
import createReducer from 'src/utils/create-reducer';
import isMobile from 'src/utils/is-mobile';
import { isUpToSmallBreakpoint } from 'src/utils/is-responsive-breakpoint';
import { ThemeSetting } from 'src/sections/repository/sections/source/types';
import ErrorCodes from 'src/constants/error-codes';

import { LoadingStatus } from 'src/constants/loading-status';
import {
  LoadGlobal,
  TOGGLE_ATLASSIAN_SWITCHER,
  TOGGLE_CREATE_DRAWER,
  TOGGLE_KB_SHORTCUT_MENU,
  TOGGLE_MOBILE_HEADER,
  TOGGLE_UP_TO_SMALL_BREAKPOINT,
  TOGGLE_SEARCH_DRAWER,
  TOGGLE_MARKETING_CONSENT_NEEDED,
  LoadIssues,
  LoadPullRequests,
  LoadRepositories,
  SEARCH,
  NETWORK_OFFLINE,
  NETWORK_ONLINE,
  UPDATE_MOBILE_HEADER_STATE,
  MobileHeaderState,
  OVERRIDE_FEATURE,
} from './actions';

import { LOAD_STATUSPAGE_INCIDENTS } from './actions/statuspage';
import { PAGE_HIDDEN, PAGE_VISIBLE } from './actions/page-visibility';
import { getGenericStatusPageIncident } from './api/statuspage-api';

type UserEmail = {
  is_primary: boolean;
  email: string;
};

type TargetFeatures = {
  pr_post_build_merge?: boolean;
};

export type GlobalState = {
  needsTermsAndConditions?: boolean;
  bitbucketActions: MenuItem[];
  importBitbucketActions: MenuItem[];
  horizontalNavigationItems: MenuItem[];
  currentUser: string | null | undefined;
  features: { [key: string]: boolean };
  focusedTaskBackButtonUrl: string | null | undefined;
  geoipCountry: string;
  hasLoadedIssues: boolean;
  hasLoadedPullRequests: boolean;
  hasLoadedRepositories: boolean;
  isAtlassianSwitcherOpen: boolean;
  isBrowserMsie11: boolean;
  isCreateDrawerOpen: boolean;
  isFocusedTask: boolean;
  isKeyboardShortcutMenuOpen: boolean;
  isLoadingIssues: boolean;
  isLoadingPullRequests: boolean;
  isLoadingRepositories: boolean;
  isNavigationOpen: boolean;
  isMobileHeaderActive: boolean;
  isUpToSmallBreakpointActive: boolean;
  mobileHeaderState: MobileHeaderState;
  isSearchDrawerOpen: boolean;
  issues: Issue[];
  needsMarketingConsent: boolean;
  pullRequests: PullRequestGlobalSearchResult[];
  repositories: RepositoryGlobalSearchResult[];
  searchQuery: string;
  targetFeatures?: TargetFeatures;
  targetUser: string | null | undefined;
  theme: ThemeSetting | null | undefined;
  teams: Team[];
  siteMessage?: SiteMessage | null;
  siteMessageStatuspageIncident?: SiteMessage | null;
  whatsNewUrl?: string;
  isPageVisible: boolean;
  isOffline: boolean;
  currentUserEmail?: string | null;
  repositoryPageLoadingStatus: {
    status: LoadingStatus;
    statusCode?: ErrorCodes;
  };
  browserMonitoring: boolean;
};

const initialState: GlobalState = {
  needsTermsAndConditions: false,
  bitbucketActions: [],
  importBitbucketActions: [],
  currentUser: null,
  features: {},
  focusedTaskBackButtonUrl: '',
  geoipCountry: '',
  hasLoadedIssues: false,
  hasLoadedPullRequests: false,
  hasLoadedRepositories: false,
  horizontalNavigationItems: [],
  isAtlassianSwitcherOpen: false,
  isBrowserMsie11: false,
  isCreateDrawerOpen: false,
  isFocusedTask: false,
  isKeyboardShortcutMenuOpen: false,
  isLoadingIssues: false,
  isLoadingPullRequests: false,
  isLoadingRepositories: false,
  isNavigationOpen: true,
  isMobileHeaderActive: isMobile(),
  isUpToSmallBreakpointActive: isUpToSmallBreakpoint(),
  mobileHeaderState: 'none',
  isSearchDrawerOpen: false,
  issues: [],
  needsMarketingConsent: false,
  pullRequests: [],
  repositories: [],
  searchQuery: '',
  targetFeatures: {},
  targetUser: null,
  teams: [],
  theme: null,
  isPageVisible: true,
  isOffline: false,
  repositoryPageLoadingStatus: {
    status: LoadingStatus.Before,
  },
  currentUserEmail: null,
  browserMonitoring: false,
};

export default createReducer<GlobalState>(initialState, {
  [LoadGlobal.SUCCESS](state, action: Action): GlobalState {
    if (!action.payload) {
      return state;
    }
    const {
      needsTermsAndConditions,
      bitbucketActions,
      importBitbucketActions,
      currentUser,
      features,
      focusedTaskBackButtonUrl,
      horizontalNavigationItems,
      needs_marketing_consent: needsMarketingConsent,
      whats_new_feed: whatsNewUrl,
      geoip_country: geoipCountry,
      isFocusedTask,
      isNavigationOpen,
      site_message: siteMessage,
      targetFeatures,
      targetUser,
      teams,
      theme,
      browser_monitoring: browserMonitoring,
    } = action.payload.result;

    return {
      ...state,
      needsTermsAndConditions,
      bitbucketActions,
      importBitbucketActions,
      currentUser,
      features,
      focusedTaskBackButtonUrl,
      horizontalNavigationItems,
      isBrowserMsie11: detectMsie11(),
      isFocusedTask,
      isNavigationOpen,
      needsMarketingConsent,
      whatsNewUrl,
      geoipCountry,
      siteMessage,
      targetFeatures,
      targetUser,
      teams,
      theme,
      browserMonitoring,
    };
  },

  [LoadIssues.REQUEST](state) {
    if (state.isLoadingIssues) {
      return state;
    }

    return {
      ...state,
      hasLoadedIssues: false,
      isLoadingIssues: true,
    };
  },

  [LoadIssues.SUCCESS](state, action) {
    if (!state.isLoadingIssues) {
      return state;
    }

    return {
      ...state,
      hasLoadedIssues: true,
      isLoadingIssues: false,
      issues: action.payload,
    };
  },

  [LoadPullRequests.REQUEST](state) {
    if (state.isLoadingPullRequests) {
      return state;
    }

    return {
      ...state,
      hasLoadedPullRequests: false,
      isLoadingPullRequests: true,
    };
  },

  [LoadPullRequests.SUCCESS](state, action) {
    if (!state.isLoadingPullRequests) {
      return state;
    }

    return {
      ...state,
      hasLoadedPullRequests: true,
      isLoadingPullRequests: false,
      pullRequests: action.payload,
    };
  },

  [LoadRepositories.REQUEST](state) {
    if (state.isLoadingRepositories) {
      return state;
    }

    return {
      ...state,
      hasLoadedRepositories: false,
      isLoadingRepositories: true,
    };
  },

  [LoadRepositories.SUCCESS](state, action) {
    if (!state.isLoadingRepositories) {
      return state;
    }

    return {
      ...state,
      hasLoadedRepositories: true,
      isLoadingRepositories: false,
      repositories: action.payload,
    };
  },

  [LOAD_STATUSPAGE_INCIDENTS.SUCCESS](state, action) {
    // If there are no Statuspage incidents, clear the state so we can resume rendering normal
    // SiteMessage banners if they exist.
    const incidents = action.payload || [];
    if (incidents.length === 0) {
      return { ...state, siteMessageStatuspageIncident: null };
    }
    return {
      ...state,
      siteMessageStatuspageIncident: getGenericStatusPageIncident(incidents),
    };
  },

  [SEARCH](state, action) {
    return {
      ...state,
      searchQuery: action.payload,
    };
  },

  [TOGGLE_ATLASSIAN_SWITCHER](state, action) {
    return {
      ...state,
      isAtlassianSwitcherOpen: action.payload,
      isCreateDrawerOpen: false,
      isSearchDrawerOpen: false,
    };
  },

  [TOGGLE_CREATE_DRAWER](state, action) {
    return {
      ...state,
      isAtlassianSwitcherOpen: false,
      isCreateDrawerOpen: action.payload,
      isSearchDrawerOpen: false,
    };
  },

  [TOGGLE_KB_SHORTCUT_MENU](state, action) {
    return {
      ...state,
      isKeyboardShortcutMenuOpen:
        action.payload !== undefined
          ? action.payload
          : !state.isKeyboardShortcutMenuOpen,
    };
  },

  [TOGGLE_MOBILE_HEADER](state, action) {
    return {
      ...state,
      isMobileHeaderActive: action.payload,
      mobileHeaderState: 'none' as MobileHeaderState,
    };
  },

  [UPDATE_MOBILE_HEADER_STATE](state, action) {
    return {
      ...state,
      mobileHeaderState: action.payload,
    };
  },

  [TOGGLE_UP_TO_SMALL_BREAKPOINT](state, action) {
    if (action.payload !== state.isUpToSmallBreakpointActive) {
      return {
        ...state,
        isUpToSmallBreakpointActive: action.payload,
      };
    }
    return state;
  },

  [TOGGLE_SEARCH_DRAWER](state, action) {
    return {
      ...state,
      isAtlassianSwitcherOpen: false,
      isCreateDrawerOpen: false,
      isSearchDrawerOpen:
        action.payload === undefined
          ? !state.isSearchDrawerOpen
          : action.payload,
      searchQuery: '',
    };
  },

  [TOGGLE_MARKETING_CONSENT_NEEDED](state, action) {
    return {
      ...state,
      needsMarketingConsent: action.payload,
    };
  },

  [PAGE_HIDDEN](state) {
    return {
      ...state,
      isPageVisible: false,
    };
  },

  [PAGE_VISIBLE](state) {
    return {
      ...state,
      isPageVisible: true,
    };
  },

  [NETWORK_OFFLINE](state) {
    return {
      ...state,
      isOffline: true,
    };
  },

  [NETWORK_ONLINE](state) {
    return {
      ...state,
      isOffline: false,
    };
  },
  [LoadRepositoryPage.SUCCESS](state) {
    return {
      ...state,
      repositoryPageLoadingStatus: {
        status: LoadingStatus.Success,
      },
    };
  },
  [LoadRepositoryPage.ERROR](state, action) {
    if (
      action.meta &&
      action.meta.status &&
      [ErrorCodes.FORBIDDEN, ErrorCodes.NOT_FOUND].includes(action.meta.status)
    ) {
      return {
        ...state,
        repositoryPageLoadingStatus: {
          status: LoadingStatus.Failed,
          statusCode: action.meta.status,
        },
      };
    }

    return {
      ...state,
    };
  },
  [FetchUserEmails.SUCCESS](state, action) {
    const emailData: UserEmail = action.payload.values.filter(
      (data: UserEmail) => data.is_primary
    );

    if (emailData) {
      return {
        ...state,
        currentUserEmail: emailData.email,
      };
    }

    return {
      ...state,
    };
  },

  // Used for overriding features in tests.
  [OVERRIDE_FEATURE](state, action) {
    const { featureKey, featureValue } = action.payload;
    return {
      ...state,
      features: {
        ...state.features,
        [featureKey]: featureValue,
      },
    };
  },
});
