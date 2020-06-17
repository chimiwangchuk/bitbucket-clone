import { defineMessages } from 'react-intl';

export default defineMessages({
  mergePullRequestAction: {
    id: 'frontbucket.repository.pullRequest.mergePullRequest',
    description: 'Action to merge a pull request',
    defaultMessage: 'Merge',
  },
  pendingMergeIconLabel: {
    id: 'frontbucket.repository.pullRequest.pendingMergeIconLabel',
    description:
      'Label passed in "clock" icon indicating that the merge is pending',
    defaultMessage: 'Pending merge',
  },
});
