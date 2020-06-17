import { defineMessages } from 'react-intl';

export default defineMessages({
  text: {
    id: 'frontbucket.repository.pullRequest.branchSyncInfo.text',
    description:
      'Text to display when source branch is behind destination branch',
    defaultMessage:
      '{numberOfCommits, plural, one {commit behind "{branchName}".} other {commits behind "{branchName}".}}',
  },
  action: {
    id: 'frontbucket.repository.pullRequest.branchSyncInfo.action',
    description: 'Text of the action to sync branches in pull request',
    defaultMessage: 'Sync now',
  },
});
