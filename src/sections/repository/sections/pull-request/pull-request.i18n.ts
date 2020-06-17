import { defineMessages } from 'react-intl';

export default defineMessages({
  pullRequestUpdated: {
    id: 'frontbucket.pullRequest.updatedFlagTitle',
    description:
      'Title for the popup flag which tells a user the pull request has been updated.',
    defaultMessage: 'This pull request was updated',
  },
  reload: {
    id: 'frontbucket.pullRequest.reloadAction',
    description: 'Link to reload the page.',
    defaultMessage: 'Reload page',
  },
  discardCommentsModalBody: {
    id: 'frontbucket.pullRequest.updatedFlagTitle.discardCommentsModalBody',
    description:
      'Body text of a confirmation dialog. Explains that unsaved comments will be lost upon reloading pull request.',
    defaultMessage:
      'Reloading the pull request discards your unsaved comments.',
  },
});
