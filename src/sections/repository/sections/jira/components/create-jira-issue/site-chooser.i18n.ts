import { defineMessages } from 'react-intl';

export default defineMessages({
  sitesFailedToLoadMessage: {
    id: 'frontbucket.createJiraIssueFromPullRequest.sitesFailedToLoadMessage',
    description:
      'Sites failed to load message when creating an issue from the pull request screen',
    defaultMessage: `We can’t load the sites`,
  },
  noSitesMessage: {
    id: 'frontbucket.createJiraIssueFromPullRequest.noSitesMessage',
    description:
      'No sites message when creating an issue from the pull request screen',
    defaultMessage: 'No sites',
  },
  sitesHeader: {
    id: 'frontbucket.createJiraIssueFromPullRequest.sitesHeader',
    description: 'Header text for the Jira sites dropdown',
    defaultMessage: 'Jira sites',
  },
});
