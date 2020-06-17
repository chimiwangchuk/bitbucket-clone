import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'fronbucket.components.forbiddenState.title',
    description: 'Title for forbidden error state',
    defaultMessage: "We can't let you see this page",
  },
  content: {
    id: 'fronbucket.components.forbiddenState.content',
    description: 'Content for forbidden error state',
    defaultMessage:
      'To access this page, you may need to {loginPageLink}. You can also return to the {previousPageLink} or go back to your {dashboardPageLink}.',
  },
  loginLinkText: {
    id: 'fronbucket.repository.forbiddenState.loginLinkText',
    description: 'Text for link to login page',
    defaultMessage: 'log in with another account',
  },
});
