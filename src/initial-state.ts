import { MergeStrategy } from './types/pull-request';
import { Workspace } from './components/types';
import { MenuItem } from './components/navigation/src/types';
import { CloneProtocol } from './components/clone-controls/types';

// This is a first-draft at typing the Initial State from the Code Review perspective,
// this typing is almost assuredly wrong in some situation or context. TRUST NOTHING.
// Thus the Partial wrapper.

export type InitialState = Partial<{
  section: {
    repository: {
      connectActions: unknown[];
      cloneProtocol: CloneProtocol;
      currentRepository: BB.Repository;
      mirrors: unknown[];
      menuItems: MenuItem[];
      bitbucketActions: MenuItem[];
      activeMenuItem: string;
    };
  };
  global: {
    theme: unknown;
    features: { [featureName: string]: boolean };
    locale: string;
    importBitbucketActions: MenuItem[];
    browser_monitoring: boolean;
    isCodeReviewWelcomeDialogOpen: boolean;
    needsTermsAndConditions: boolean;
    is_mobile_user_agent: boolean;
    site_message: string;
    commitViewSidebarWidth: string | number | null;
    codeReviewSidebarWidth: string | number | null;
    path: string;
    currentUser: BB.User;
    sourceBrowserSidebarWidth: string | number | null;
    bitbucketActions: MenuItem[];
    needs_marketing_consent: boolean;
    isCommitViewSidebarOpen: boolean;
    targetUser: BB.User;
    geoip_country: string;
    targetFeatures: { [featureName: string]: boolean };
    isFocusedTask: boolean;
    teams: Workspace[];
    isCodeReviewSidebarOpen: boolean;
    flags: unknown[];
    isNavigationOpen: boolean;
    focusedTaskBackButtonUrl: string;
    isSourceBrowserSidebarOpen: boolean;
    whats_new_feed: string;
  };
  repository: {
    pullRequest: {
      defaultMergeStrategy: MergeStrategy | null;
      currentPullRequest: BB.PullRequest;
    };
  };
}>;

const state: InitialState = JSON.parse(
  // eslint-disable-next-line no-restricted-properties
  JSON.stringify(window.__initial_state__ || {})
);

export default state;
