import { get } from 'lodash-es';
import {
  ConnectHost,
  ConnectModule,
  AddonManager,
  sendAnalyticsEvent,
  registerAnalyticsListener,
} from '@atlassian/bitbucket-connect-js';
import { publishFact } from 'src/utils/analytics/publish';
import { createConnectFact } from 'src/utils/connect-analytics';
import authRequest from 'src/utils/fetch';

// `ConnectModulesState` is not exposed from the @atlassian/bitbucket-connect-js package,
// so copy/paste for now
export type ConnectModulesState = {
  modules: ConnectModule[];
  loading: boolean;
  error: any;
  principalId?: string;
  target?: any;
};

// This handles connect analytics events. e.g. WebItem clicked, Iframe loaded, etc...
// @ts-ignore TODO: fix noImplicitAny error here
registerAnalyticsListener((eventName, eventData) => {
  publishFact(createConnectFact(eventName, eventData));
});

async function getScopes() {
  const response = await fetch('/site/oauth2/scopes');
  return response.json();
}

async function denyOAuth(clientId: string) {
  const response = await fetch(
    authRequest(
      `/!api/internal/consumers/${encodeURIComponent(clientId)}/denials`,
      {
        method: 'PUT',
      }
    )
  );
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return Promise.resolve();
}

AddonManager.setOAuthScopesHandler((onSucess, onError) => {
  getScopes()
    .then(onSucess)
    .catch(onError);
});

AddonManager.setDenyOAuthHandler((moduleId, onSuccess, onError) => {
  const mod = AddonManager.modules.get(moduleId);
  const clientId = get(mod, 'options.client-id');
  if (!mod || !clientId) {
    onError(); // call error handler
  }
  denyOAuth(clientId)
    .then(onSuccess)
    .catch(onError);
});

AddonManager.setManagePermissionsUrlProvider(() => `/account/admin/api`);

export { ConnectHost, AddonManager, sendAnalyticsEvent };
