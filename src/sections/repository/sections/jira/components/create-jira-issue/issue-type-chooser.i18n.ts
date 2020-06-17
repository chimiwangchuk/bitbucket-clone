import { defineMessages } from 'react-intl';

export default defineMessages({
  issueTypesFailedToLoadMessage: {
    id:
      'frontbucket.createJiraIssueFromPullRequest.issueTypesFailedToLoadMessage',
    description:
      'Issue types failed to load message when creating an issue from the pull request screen',
    defaultMessage: `We can’t load your project issue types`,
  },
  noIssueTypesMessage: {
    id: 'frontbucket.createJiraIssueFromPullRequest.noIssueTypesMessage',
    description:
      'No issue types message when creating an issue from the pull request screen',
    defaultMessage: `The project doesn’t have any issue type associated`,
  },
});
