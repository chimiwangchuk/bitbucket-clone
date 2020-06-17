import { defineMessages } from 'react-intl';

export default defineMessages({
  commentsGlobalTitle: {
    id: 'frontbucket.repository.pullRequestConversation.globalTitle',
    description: 'Title of global comments section on a pull request page',
    defaultMessage:
      '{count, plural, one {{count} comment} other {{count} comments}}',
  },
  commentsGlobalAddComment: {
    id: 'frontbucket.repository.pullRequestConversation.globalAddComment',
    description:
      'Placeholder text in global comments section on a pull request page',
    defaultMessage: 'Add a comment',
  },
  globalConversationLabel: {
    id: 'frontbucket.repository.pullRequestConversation.globalLabel',
    description: 'Label for the global comments section on a pull request page',
    defaultMessage: 'Global comments',
  },
  createTaskLabel: {
    id: 'frontbucket.repository.pullRequestConversation.createTaskLabel',
    description:
      'Label for button which initiates task creation in the pull request comments section',
    defaultMessage: 'Create task',
  },
});
