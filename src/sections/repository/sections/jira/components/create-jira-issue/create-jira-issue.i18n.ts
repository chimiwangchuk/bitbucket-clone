import { defineMessages } from 'react-intl';

export default defineMessages({
  createIssueButtonLabel: {
    id: 'frontbucket.createJiraIssueFromPullRequest.createIssueButtonLabel',
    description:
      'Create issue button label when creating an Jira issue from the pull request screen',
    defaultMessage: 'Create Jira issue',
  },
  issueSummaryPlaceholder: {
    id: 'frontbucket.createJiraIssueFromPullRequest.issueSummaryPlaceholder',
    description:
      'Summary placeholder text when creating an Jira issue from the pull request screen',
    defaultMessage: 'What needs to be done?',
  },
  siteChooserLabel: {
    id: 'frontbucket.createJiraIssueFromPullRequest.siteChooserLabel',
    description:
      'Site chooser label shown when creating an Jira issue from the pull request screen',
    defaultMessage: 'New issue in',
  },
  projectChooserLabel: {
    id: 'frontbucket.createJiraIssueFromPullRequest.projectChooserLabel',
    description:
      'Project chooser label shown when a Jira issue is created from the pull request screen',
    defaultMessage: 'in',
  },
  issueCreationFailedGenericMessage: {
    id:
      'frontbucket.createJiraIssueFromPullRequest.issueCreationFailedGenericMessage',
    description:
      'Failed to create the Jira issue from pull request screen because of an unknown error',
    defaultMessage: `We can’t create the issue, {createInJiraLink}`,
  },
  issueCreationFailedUnsupportedFieldsMessage: {
    id:
      'frontbucket.createJiraIssueFromPullRequest.issueCreationFailedUnsupportedFieldsMessage',
    description:
      'Failed to create the Jira issue from pull request screen because of unsupported fields',
    defaultMessage: `Some fields are not supported in this issue type. Change issue type or {createInJiraLink}`,
  },
  issueCreationForbidden: {
    id: 'frontbucket.createJiraIssueFromPullRequest.issueCreationForbidden',
    description: 'User does not have permission to create issues',
    defaultMessage:
      'You don’t have permission to create issue in this project. Make sure you have write permission or choose a different project.',
  },
  cancelButtonText: {
    id: 'frontbucket.createJiraIssueFromPullRequest.cancelButtonText',
    description: 'Text for the button to cancel creating a Jira issue',
    defaultMessage: 'Cancel',
  },
  submitButtonText: {
    id: 'frontbucket.createJiraIssueFromPullRequest.submitButtonText',
    description: 'Text for the button to create a Jira issue',
    defaultMessage: 'Create',
  },
  createInJiraLinkText: {
    id: 'frontbucket.createJiraIssueFromPullRequest.createInJiraLinkText',
    description: 'Text for the link to create the issue in Jira',
    defaultMessage: 'create in Jira.',
  },
});
