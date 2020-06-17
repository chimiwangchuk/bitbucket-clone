import { SpotlightManager } from '@atlaskit/onboarding';

import React, { Component } from 'react';
// @ts-ignore TODO: fix noImplicitAny error here
import Helmet from 'react-helmet';
import { addLocaleData, IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import CrossFlowProvider from '@atlassiansox/cross-flow-support/bitbucket';
import FabricAnalyticsListeners, {
  FabricChannel,
} from '@atlaskit/analytics-listeners';
import { FeatureProvider } from 'src/contexts/feature-provider';
import { Provider as ConnectProvider } from '@atlassian/bitbucket-connect-react';
import { Router as AtlaskitRouter, history, getRoutes } from 'src/router';
import { FactContext } from '@atlassian/bitkit-analytics';
import Favicon from 'src/components/favicon';
import KeyboardShortcutDialog from 'src/components/keyboard-shortcut-dialog';
import HistoryWatcher from 'src/components/performance-metrics/history-watcher';
import { withStatsd } from 'src/components/performance-metrics/with-statsd';
import WorkspacesOnboarding from 'src/sections/workspace/workspaces-onboarding';
import { ConnectHost, AddonManager, sendAnalyticsEvent } from 'src/connect';
import Flags from 'src/sections/global/containers/flags';
import GlobalCreateBranchDialog from 'src/sections/create-branch/containers/global-dialog';
import MarketingConsentManager from 'src/sections/global/containers/marketing-consent-manager';
import SiteMessageFlagManager from 'src/sections/global/containers/site-message-flag-manager';
import TermsAndConditionsModal from 'src/sections/global/components/terms-and-conditions-modal';
import { publishFact } from 'src/utils/analytics/publish';
import {
  analyticsClient,
  AnalyticsClientInit,
} from 'src/utils/analytics/client';
import { DEFAULT_TITLE, TITLE_TEMPLATE } from 'src/constants/helmet';
import { InjectIntlContext } from 'src/hooks/intl';
import IeDeprecationManager from 'src/sections/global/containers/ie-deprecation-manager';
import { getSsrFeatures } from 'src/utils/ssr-features';
import locale from '../locale';
import { LoadGlobal } from '../components/load-global';
import { bitbucketStore as ourStore } from '../store';
import windowSettings from '../settings';
import Routes from './routes';
import UniversalRoutes from './universal-routes';

const EXCLUDED_CHANNELS = [
  FabricChannel.atlaskit,
  FabricChannel.elements,
  FabricChannel.editor,
];

class Root extends Component<any> {
  // @ts-ignore TODO: fix noImplicitAny error here
  constructor(props) {
    super(props);
    if (!locale.localeData) {
      return;
    }
    addLocaleData(locale.localeData);

    if (locale.isDummyLocale) {
      // @ts-ignore Is this argument even used?
      addLocaleData({ locale: locale.locale, parentLocale: 'en' });
    }
  }

  render() {
    const { appSettings = windowSettings, isSsr, location } = this.props;
    const { isAtlaskitRouterEnabled } = getSsrFeatures();
    const routes = getRoutes();

    return (
      <IntlProvider locale={locale.locale} messages={locale.messages}>
        <InjectIntlContext>
          <CrossFlowProvider
            analyticsClient={analyticsClient()}
            locale={locale.locale}
          >
            <Provider store={ourStore}>
              <ConnectProvider
                connectHost={ConnectHost}
                addonManager={AddonManager}
                analyticsEventHandler={sendAnalyticsEvent}
              >
                <FactContext.Provider value={{ publishFact }}>
                  <FabricAnalyticsListeners
                    client={analyticsClient()}
                    excludedChannels={EXCLUDED_CHANNELS}
                  >
                    <FeatureProvider>
                      <SpotlightManager>
                        {!isAtlaskitRouterEnabled && (
                          <LoadGlobal>
                            <BrowserRouter>
                              <>
                                <KeyboardShortcutDialog />
                                <HistoryWatcher />
                                <Favicon />
                                <AnalyticsClientInit />
                                <Flags />
                                <Helmet
                                  defaultTitle={DEFAULT_TITLE}
                                  titleTemplate={TITLE_TEMPLATE}
                                />
                                <MarketingConsentManager />
                                <SiteMessageFlagManager />
                                <IeDeprecationManager />
                                <TermsAndConditionsModal />
                                <WorkspacesOnboarding />
                                <GlobalCreateBranchDialog />
                                <Routes />
                              </>
                            </BrowserRouter>
                          </LoadGlobal>
                        )}
                        {isAtlaskitRouterEnabled && (
                          <AtlaskitRouter
                            history={history}
                            routes={routes}
                            resourceContext={{
                              reduxStore: ourStore,
                              appSettings,
                            }}
                            isSsr={isSsr}
                            location={location}
                          >
                            <>
                              <KeyboardShortcutDialog />
                              <Favicon />
                              <AnalyticsClientInit />
                              <Flags />
                              <Helmet
                                defaultTitle={DEFAULT_TITLE}
                                titleTemplate={TITLE_TEMPLATE}
                              />
                              <MarketingConsentManager />
                              <SiteMessageFlagManager />
                              <IeDeprecationManager />
                              <TermsAndConditionsModal />
                              <WorkspacesOnboarding />
                              <GlobalCreateBranchDialog />
                              <UniversalRoutes />
                            </>
                          </AtlaskitRouter>
                        )}
                      </SpotlightManager>
                    </FeatureProvider>
                  </FabricAnalyticsListeners>
                </FactContext.Provider>
              </ConnectProvider>
            </Provider>
          </CrossFlowProvider>
        </InjectIntlContext>
      </IntlProvider>
    );
  }
}

export default withStatsd('performance.app.mounted')(Root);
