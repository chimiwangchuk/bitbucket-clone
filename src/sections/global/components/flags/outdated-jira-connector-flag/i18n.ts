import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'frontbucket.flags.outdatedJiraConnectorFlag.title',
    description: 'Flag title',
    defaultMessage: 'Action required for Jira DVCS connector',
  },
  body: {
    id: 'frontbucket.flags.outdatedJiraConnectorFlag.body',
    description: 'Text to inform the user that jira connector is outdated',
    defaultMessage:
      'Update your Jira DVCS connector before February 17, 2020 to maintain the functionality of your Jira server integration with Bitbucket Cloud.',
  },
  linkText: {
    id: 'frontbucket.flags.outdatedJiraConnectorFlag.linkText',
    description: 'Text of link to "learn more" page',
    defaultMessage: 'Learn more',
  },
  dismissButton: {
    id: 'frontbucket.flags.outdatedJiraConnectorFlag.dismissButton',
    description: 'Text of button for dismiss flag',
    defaultMessage: 'Not now',
  },
});
