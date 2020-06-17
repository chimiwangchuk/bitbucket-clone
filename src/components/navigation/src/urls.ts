import qs from 'qs';
import { BbEnv } from './types';

const urls = {
  api: {
    internal: {
      availableProducts: () => '/!api/internal/my/available-products',
    },
    v10: {},
    v20: {},
    gateway: {
      availableProducts: () => '/gateway/api/worklens/api/available-products',
    },
  },
  external: {
    apiDocumentation: () => 'https://confluence.atlassian.com/x/IYBGDQ',
    atlassian: () => 'https://www.atlassian.com',
    atlassianAccountLogout: (aaLogoutUrl: string, canonUrl: string) =>
      `${aaLogoutUrl}?${qs.stringify({
        continue: `${canonUrl}${urls.ui.logout()}`,
      })}`,
    bamboo: () => 'https://www.atlassian.com/software/bamboo',
    blog: () => 'https://blog.bitbucket.org',
    confluence: () =>
      'https://www.atlassian.com/software/confluence/overview/team-collaboration-software',
    documentation: () => 'https://confluence.atlassian.com/display/BITBUCKET',
    gettingGitRight: () => 'https://www.atlassian.com/git',
    hipChat: () => 'https://www.hipchat.com',
    jiraSoftware: () =>
      'https://www.atlassian.com/software/jira/bitbucket-integration',
    privacyPolicy: () => 'https://www.atlassian.com/legal/privacy-policy',
    sourceTree: () => 'https://www.sourcetreeapp.com',
    status: () => 'https://status.bitbucket.org',
    termsOfService: () => 'https://www.atlassian.com/legal/customer-agreement',
    tutorials: () => 'https://confluence.atlassian.com/x/Q4sFLQ',
    apiPrivate: (bbEnv: BbEnv) =>
      bbEnv === BbEnv.Production
        ? 'https://api-private.atlassian.com'
        : 'https://api-private.stg.atlassian.com',
  },
  ui: {
    integrations: (workspaceSlug?: string) =>
      workspaceSlug
        ? `/${workspaceSlug}/workspace/settings/addon-directory/`
        : `/account/admin/addon-directory/`,
    labs: (hasWorkspaceUi?: boolean) =>
      hasWorkspaceUi
        ? `/account/settings/features/`
        : `/account/admin/features/`,
    login: () => '/account/signin/',
    logout: () => '/account/signout/',
    plans: () => '/plans',
    root: () => '/',
    settings: (uuid: string, hasWorkspaceUi?: boolean) =>
      hasWorkspaceUi ? `/account/settings/` : `/account/user/${uuid}/`,
    signup: () => '/account/signup/',
    support: () => '/support',
    allWorkspaces: () => '/account/workspaces/',
  },
};

export default urls;
