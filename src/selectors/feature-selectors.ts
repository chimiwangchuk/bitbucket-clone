import { createSelector } from 'reselect';
import { GlobalState } from 'src/redux/global/reducer';
import {
  FF_ATLASKIT_ROUTER_ENABLED,
  FF_ATLASKIT_ROUTER_RESOURCES_DASHBOARD_ENABLED,
} from '../router/constants';
import { getGlobal } from './state-slicing-selectors';

export const getFeatures = createSelector(getGlobal, (state: GlobalState) =>
  state && state.features ? state.features : {}
);

export const getFeature = (feature: string) =>
  createSelector(getFeatures, features => !!features[feature]);

export const getIsAtlaskitRouterEnabled = createSelector(
  getFeatures,
  features => !!features[FF_ATLASKIT_ROUTER_ENABLED]
);

export const getIsAtlaskitRouterResourcesForDashboardEnabled = createSelector(
  getIsAtlaskitRouterEnabled,
  getFeatures,
  (isAtlaskitRouterEnabled, features) =>
    isAtlaskitRouterEnabled &&
    !!features[FF_ATLASKIT_ROUTER_RESOURCES_DASHBOARD_ENABLED]
);

export const getIsWordWrapEnabled = getFeature('fd-new-code-review-word-wrap');

export const getIsFx3Enabled = getFeature('enable-fx3-client');

export const getIsParcelBundlesEnabled = createSelector(
  getFeatures,
  features => !!features['parcel-frontbucket-bundles']
);

export const getIsNewSourceEnabled = createSelector(
  getFeatures,
  features => !!features['new-source-browser']
);

export const getIsHorizontalNavEnabled = createSelector(
  getFeatures,
  features => !!features['fd-horizontal-nav']
);

export const getIsNewCodeReviewEnabled = createSelector(
  getFeatures,
  features => !!features['new-code-review']
);

export const getIsNewCodeReviewEnabledForTeam = createSelector(
  getGlobal,
  (state: GlobalState) =>
    // @ts-ignore TODO: fix noImplicitAny error here
    state.targetFeatures && !!state.targetFeatures['new-code-review-teams']
);

export const getIsLeaveRepositoryEnabled = createSelector(
  getFeatures,
  features => !!features['frontbucket-leave-repository']
);

export const getIsForceOldCodeReview = createSelector(
  getFeatures,
  features => !!features['force-old-code-review']
);

export const getIsWorkspaceUiEnabled = createSelector(
  getFeatures,
  features => !!features['workspace-ui']
);

export const getIsNewOnboardingEnabled = createSelector(
  getFeatures,
  features => !!features['new-code-review-onboarding-experience']
);

export const getSkipExcessiveDiffs = createSelector(
  getFeatures,
  features => !!features['crf-skip-excessive-diffs']
);

export const getArePullRequestRenderingLimitsActive = createSelector(
  getFeatures,
  features => !!features['large-pr-rendering-limits']
);

export const getIsPrAnnotationsEnabled = createSelector(
  getFeatures,
  features => !!features['pr-annotations-from-pipelines']
);

export const getShowCommentsBuildsStatusesPullRequestPageEnabled = createSelector(
  getFeatures,
  features => !!features['add-comments-builds-statuses-pull-request-page']
);

export const getIsXFlowIntegrationRolloutEnabled = createSelector(
  getFeatures,
  features => !!features['fd-x-flow-integration-rollout']
);

export const getIsXFlowIntegrationSwitchEnabled = createSelector(
  getFeatures,
  features => !!features['x-flow-integration-switch']
);

export const getIsRepositoriesCardsView = createSelector(
  getFeatures,
  features => !!features['repositories-cards-view']
);

export const getIsShowMegaLaunchFlag = createSelector(
  getFeatures,
  features => !!features['fd-show-mega-launch-flag']
);

export const getIsJiraRepoPageM2Enabled = createSelector(
  getFeatures,
  features => !!features['repo-nav-jira-tab-m2']
);

export const getIsShowUpgradePlansBanner = createSelector(
  getFeatures,
  features => !!features['show-upgrade-plans-banner']
);

export const getIsViewEntireFileEnabled = createSelector(
  getFeatures,
  features => !!features['fd-new-code-review-view-entire-file']
);

export const getIsRepositoryPageLoadingErrorGuardEnabled = createSelector(
  getFeatures,
  features => !!features['fd-repository-page-loading-error-guard']
);

export const getIsAdditionalProfileInformationEnabled = createSelector(
  getFeatures,
  features => !!features['profile-section-user-metadata']
);

export const getIsUpdatedPrFilterEnabled = createSelector(
  getFeatures,
  features => !!features['fd-pullrequest-filter-update']
);

export const getIsExpiresDurationInApiToken = createSelector(
  getFeatures,
  features => !!features['expires-duration-in-api-token']
);

export const getIsMergePullRequestsAsyncEnabled = createSelector(
  getFeatures,
  features => !!features['merge-pull-requests-async']
);

export const getIsCodeReviewSingleFileModeEnabled = getFeature(
  'fd-new-code-review-single-file-mode'
);

export const getIsPRActivityUpdatesAPIEnabled = createSelector(
  getFeatures,
  features => !!features['show-pr-update-activity-changes']
);

export const getIsDiffStatEscapedFilePathsEnabled = createSelector(
  getFeatures,
  features => !!features['diffstat-api-escaped-file-paths']
);
