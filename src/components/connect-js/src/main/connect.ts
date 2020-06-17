// @ts-ignore TODO: fix noImplicitAny error here
import ConnectHost from 'atlassian-connect-js';
// @ts-ignore TODO: fix noImplicitAny error here
import ConnectHistory from 'atlassian-connect-js-history/dist/connect-host-history';
import AddonManager from './addonManager';
import * as ConnectAPI from './api';
import * as EditorAPI from './editor';
import * as ContentReplacerAPI from './contentReplacer';
import * as AnalyitcsAPI from './analytics/api';
import * as LinksAPI from './links';

// set env from ConnectAPI
ConnectAPI.getHostEnv((err, env) => !err && AddonManager.setEnv(env));

// set current user and isAuthenticated FLAG
ConnectAPI.getCurrentUser(
  (err, user) => !err && AddonManager.setCurrentUser(user)
);

// add ConnectAPI module to ConnectHost
ConnectHost.defineModule('bitbucket', {
  ...ConnectAPI,
  ...EditorAPI,
  ...ContentReplacerAPI, // This API is for Atlassian only (site-addons)
});

// add LinkersAPI module to ConnectHost
ConnectHost.defineModule('links', LinksAPI);

// add analytics API to connect
ConnectHost.defineModule('analytics', AnalyitcsAPI);

// add history API to connect
ConnectHost.defineModule('history', ConnectHistory);

// register content resolver
// required, but not currently used by bitbucket-connect-js
// is used to do async data fetching before rendering an iframe
ConnectHost.registerContentResolver.resolveByExtension(() => {
  return {
    fail: () => {},
    done: () => {},
  };
});

// required by history API
const globalWindow: any = window;
globalWindow.connectHost = ConnectHost;

export default ConnectHost;
