import { stringify } from './utils';

export default {
  external: {
    support: 'https://support.atlassian.com/bitbucket-cloud/',
    jiraConnectorLearnMore: 'https://confluence.atlassian.com/x/xf6wOQ',
    suggestOrRequireChecksBeforeMerge:
      'https://confluence.atlassian.com/x/EhMQMw',
    accessKeys: 'https://confluence.atlassian.com/x/I4CNEQ',
    generateSshKey: 'https://confluence.atlassian.com/x/X4FmKw',
    troubleshootSsh: 'https://confluence.atlassian.com/x/64Y1E',
  },
  api: {
    internal: {
      issues: () => '/!api/internal/my/issues',
      pullRequests: () => '/!api/internal/my/pull-requests',
      repositories: () => '/!api/internal/my/repositories',
    },
  },
  ui: {
    createBranch: (
      issueKey?: string,
      issueType?: string,
      issueSummary?: string
    ) => {
      const query = stringify({
        issueKey,
        issueType,
        issueSummary,
      });
      return `/branch/create${query}`;
    },
  },
};
