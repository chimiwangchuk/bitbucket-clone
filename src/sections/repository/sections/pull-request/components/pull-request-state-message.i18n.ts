import { defineMessages } from 'react-intl';

export default defineMessages({
  mergedPullRequestStateMessage: {
    id: 'frontbucket.repository.pullRequest.mergedPullRequestStateMessage',
    description:
      'Text displayed in the section message for a merged pull request',
    defaultMessage: 'Merged pull request',
  },
  declinedPullRequestStateMessage: {
    id: 'frontbucket.repository.pullRequest.declinedPullRequestStateMessage',
    description:
      'Text displayed in the section message for a declined pull request',
    defaultMessage: 'Declined pull request',
  },
  readyToMergePullRequestStateMessage: {
    id:
      'frontbucket.repository.pullRequest.readyToMergePullRequestStateMessage',
    description:
      'Text displayed in the section message for a ready to merge pull request',
    defaultMessage: 'This pull request is ready to merge',
  },
  readyToMergePullRequestDescription: {
    id: 'frontbucket.repository.pullRequest.readyToMergePullRequestDescription',
    description: 'Description for ready to merge state message',
    defaultMessage: 'All merge checks have passed.',
  },
  mergePullRequestLink: {
    id: 'frontbucket.repository.pullRequest.mergePullRequestLink',
    description:
      'Text for link to merge pull request in ready to merge state message',
    defaultMessage: 'Merge pull request',
  },
});
