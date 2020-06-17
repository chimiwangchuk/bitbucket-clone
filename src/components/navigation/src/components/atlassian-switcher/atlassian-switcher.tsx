import React, { useState, useEffect } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import Switcher from '@atlaskit/atlassian-switcher';
import {
  createAvailableProductsProvider,
  createJoinableSitesProvider,
} from '@atlaskit/atlassian-switcher/create-custom-provider';
import Drawer from '@atlaskit/drawer';
// @ts-ignore TODO: fix noImplicitAny error here
import { GlobalItem } from '@atlaskit/navigation-next';
import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher';
import { useCrossFlow } from '@atlassiansox/cross-flow-support/bitbucket';

import urls from '../../urls';
import { getJoinableSiteNavData } from '../../utils/joinable-sites-nav';
import { defaultXFlowUrl } from '../../utils/switcher';
import { AnalyticsEvent, Product } from '../../types';
import messages from './atlassian-switcher.i18n';
import * as styles from './atlassian-switcher.style';
import {
  AtlassianSessionStatus,
  useAtlassianSession,
} from './atlassian-session-hook';

const getBucket = (
  isXFlowIntegrationRolloutEnabled: boolean
): 'control' | 'variation' => {
  return isXFlowIntegrationRolloutEnabled ? 'variation' : 'control';
};

const getEarlyCohort = (
  isXFlowIntegrationRolloutEnabled: boolean,
  isXFlowIntegrationSwitchEnabled: boolean
): 'control' | 'variation' | 'not-enrolled' => {
  return isXFlowIntegrationSwitchEnabled
    ? getBucket(isXFlowIntegrationRolloutEnabled)
    : 'not-enrolled';
};

const getCohort = (
  isXFlowIntegrationRolloutEnabled: boolean,
  isXFlowIntegrationSwitchEnabled: boolean,
  hasAtlassianSession: boolean,
  hasCrossFlowEnabled: boolean
) => {
  return hasAtlassianSession && hasCrossFlowEnabled
    ? getEarlyCohort(
        isXFlowIntegrationRolloutEnabled,
        isXFlowIntegrationSwitchEnabled
      )
    : 'not-enrolled';
};

const openXFlowUrl = (targetProduct: Product) => {
  const url = defaultXFlowUrl[targetProduct];
  if (url) {
    const win = window.open(url, '_blank');
    if (win) {
      win.focus();
    }
  }
};

const customAvailableProductsDataProvider = createAvailableProductsProvider(
  urls.api.internal.availableProducts()
);

const createCustomJoinableSitesDataProvider = (
  userUuid: string | undefined,
  captureException: (e: Error) => void
) => {
  return createJoinableSitesProvider(
    // we expected that getJoinableSitesWithRelevance() is fired already in index-next.tsx
    // so at here we will just use getJoinableSitesWithRelevanceFromCache()
    // Limitation:
    // - race condition may occur if an user opens the Altassian Switcher before cached data is ready
    // - the Join section will not show up in case there is no "sites" data
    () =>
      Promise.resolve({
        sites: getJoinableSiteNavData(userUuid, captureException),
      })
  );
};

export type AtlassianSwitcherProps = {
  captureException: (e: Error) => void;
  globalItemStyles?: (styles: {}) => {};
  isAtlassianSwitcherOpen: boolean;
  isGrowthJoinableSitesCalculationEnabled: boolean;
  isGrowthJoinSectionInAtlassianSwitcherEnabled: boolean;
  isLoggedIn: boolean;
  isXFlowIntegrationRolloutEnabled: boolean;
  isXFlowIntegrationSwitchEnabled: boolean;
  onToggleAtlassianSwitcher: (isOpen: boolean) => void;
  publishTrackEvent: (event: AnalyticsEvent) => void;
  userUuid?: string | undefined;
};

type InjectedAtlassianSwitcherProps = AtlassianSwitcherProps & {
  intl: InjectedIntl;
};

const AtlassianSwitcher: React.FC<InjectedAtlassianSwitcherProps> = props => {
  const {
    captureException,
    globalItemStyles,
    intl,
    isAtlassianSwitcherOpen,
    isGrowthJoinableSitesCalculationEnabled,
    isLoggedIn,
    isXFlowIntegrationRolloutEnabled,
    isXFlowIntegrationSwitchEnabled,
    onToggleAtlassianSwitcher,
    publishTrackEvent,
    userUuid,
  } = props;

  const crossFlow = useCrossFlow();

  // BBCFAM-556: This check for active Atlassian session can be removed once PC-12617 is done.
  // Only check when the switcher is open.
  const atlassianSessionStatus = useAtlassianSession(isAtlassianSwitcherOpen);

  // The current experience of x-flow is to redirect users to WAC for signing up
  // for Atlassian products. We are changing this to provide an in-product sign-up
  // experience without redirecting to WAC.
  //
  // - If the x-flow-integration-switch is disabled fall back to redirecting WAC.
  // - The x-flow-integration-rollout flag is for partial rollout of the feature,
  //   if it is off, fallback to redirecting to WAC.
  const isXFlowFeatureEnabled =
    isXFlowIntegrationRolloutEnabled && isXFlowIntegrationSwitchEnabled;

  const hasAtlassianSession =
    atlassianSessionStatus === AtlassianSessionStatus.HasSession;

  const atlassianSessionResolvd =
    atlassianSessionStatus === AtlassianSessionStatus.HasSession ||
    atlassianSessionStatus === AtlassianSessionStatus.NoSession;

  const [
    isGrowthJoinSectionInAtlassianSwitcherEnabled,
    setIsGrowthJoinSectionInAtlassianSwitcherEnabled,
  ] = useState(false);

  useEffect(() => {
    // Fire an exposure event only when the switcher is open.
    if (isAtlassianSwitcherOpen) {
      // Wait for the Atlassian session status to be available before firing the event.
      if (atlassianSessionResolvd) {
        publishTrackEvent({
          source: 'atlassianSwitcher',
          action: 'exposed',
          actionSubject: 'experiment',
          actionSubjectId: 'atlassianSwitcherWithCrossFlowEssentials',
          attributes: {
            bucket: getBucket(isXFlowIntegrationRolloutEnabled),
            cohort: getCohort(
              isXFlowIntegrationRolloutEnabled,
              isXFlowIntegrationSwitchEnabled,
              hasAtlassianSession,
              crossFlow.isEnabled
            ),
            earlyCohort: getEarlyCohort(
              isXFlowIntegrationRolloutEnabled,
              isXFlowIntegrationSwitchEnabled
            ),
            hasAtlassianSession,
            hasCrossFlowEnabled: crossFlow.isEnabled,
          },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atlassianSessionStatus, isAtlassianSwitcherOpen]);

  useEffect(() => {
    // @ts-ignore
    const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    const unenrolledReasons: string[] = [];
    const initialEnrolled = props.isGrowthJoinSectionInAtlassianSwitcherEnabled;

    let finalEnrolled = false;
    let error: Error | null = null;
    try {
      if (initialEnrolled) {
        if (!isGrowthJoinableSitesCalculationEnabled) {
          unenrolledReasons.push('JOINABLE_SITE_CALULATION_NOT_ENABLED');
        }

        if (isIE11) {
          unenrolledReasons.push('IE_11');
        }

        if (!isLoggedIn || !userUuid) {
          unenrolledReasons.push('NO_USER');
        }

        finalEnrolled = unenrolledReasons.length === 0;
      } else {
        unenrolledReasons.push('NOT_ENROLLED');
      }
    } catch (e) {
      error = e;
      captureException(e);
      unenrolledReasons.push('ERROR');
    } finally {
      publishTrackEvent({
        source: 'atlassianSwitcher',
        action: 'exposed',
        actionSubject: 'experiment',
        actionSubjectId: 'atlassianSwitcherWithDESJoinableSite',
        attributes: {
          key: 'growth-join-section-in-atlassian-switcher',
          initialEnrolled,
          enrolled: finalEnrolled,
          reasons: unenrolledReasons,
          error: error ? error.message : null,
        },
      });

      setIsGrowthJoinSectionInAtlassianSwitcherEnabled(finalEnrolled);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTriggerXFlow = (targetProduct: Product) => {
    if (isXFlowFeatureEnabled && crossFlow.isEnabled && hasAtlassianSession) {
      crossFlow.api.open({
        targetProduct,
        sourceComponent: 'atlassian-switcher',
        sourceContext: 'recommendation',
      });
    } else {
      openXFlowUrl(targetProduct);
    }
  };

  const onDiscoverMoreClicked = () => {
    if (isXFlowFeatureEnabled && crossFlow.isEnabled && hasAtlassianSession) {
      crossFlow.api.open({
        targetProduct: '',
        sourceComponent: 'atlassian-switcher',
        sourceContext: 'more',
      });
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <React.Fragment>
      <GlobalItem
        styles={globalItemStyles}
        icon={AppSwitcherIcon}
        onClick={() => onToggleAtlassianSwitcher(true)}
        size="small"
        label={intl.formatMessage(messages.trigger)}
        tooltip={intl.formatMessage(messages.tooltip)}
      />
      <Drawer
        isOpen={isAtlassianSwitcherOpen}
        onClose={() => onToggleAtlassianSwitcher(false)}
      >
        <styles.SwitcherWrapper>
          <Switcher
            appearance="drawer"
            product="bitbucket"
            availableProductsDataProvider={customAvailableProductsDataProvider}
            joinableSitesDataProvider={
              isGrowthJoinSectionInAtlassianSwitcherEnabled && userUuid
                ? createCustomJoinableSitesDataProvider(
                    userUuid,
                    captureException
                  )
                : undefined
            }
            disableCustomLinks
            disableRecentContainers
            triggerXFlow={onTriggerXFlow}
            onDiscoverMoreClicked={onDiscoverMoreClicked}
            isDiscoverSectionEnabled
            isDiscoverMoreForEveryoneEnabled={
              isXFlowFeatureEnabled &&
              crossFlow.isEnabled &&
              hasAtlassianSession
            }
          />
        </styles.SwitcherWrapper>
      </Drawer>
    </React.Fragment>
  );
};

export default injectIntl(AtlassianSwitcher);
