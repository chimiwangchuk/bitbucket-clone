// @ts-ignore TODO: fix noImplicitAny error here
import AnalyticsWebClient from '@atlassiansox/analytics-web-client/dist/esm/analyticsWebClient';
import {
  envType,
  tenantType,
  userType,
  originType,
  // @ts-ignore TODO: fix noImplicitAny error here
} from '@atlassiansox/analytics-web-client/dist/esm/analyticsWebTypes';

const analyticsEnvironment = (env: string) => {
  if (env === 'production') {
    return envType.PROD;
  } else if (env === 'staging') {
    return envType.STAGING;
  } else if (env === 'development') {
    return envType.DEV;
  }
  return envType.LOCAL;
};

// It would be nice if the client came with types,
// see https://extranet.atlassian.com/jira/browse/SOC-503
export const createAnalyticsClient = (
  env: string,
  version: string,
  locale: string,
  user?: BB.User
): AnalyticsWebClient => {
  const analyticsEnv = analyticsEnvironment(env);
  const client = new AnalyticsWebClient({
    env: analyticsEnv,
    product: 'bitbucket',
    version,
    origin: originType.WEB,
    locale,
  });
  client.setTenantInfo(tenantType.NONE);

  if (user && user.account_id) {
    client.setUserInfo(userType.ATLASSIAN_ACCOUNT, user.account_id);
  }

  return client;
};
