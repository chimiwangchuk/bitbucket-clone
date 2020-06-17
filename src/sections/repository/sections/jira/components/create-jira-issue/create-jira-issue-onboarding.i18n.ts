import { defineMessages } from 'react-intl';

export default defineMessages({
  skipButtonLabel: {
    id: 'frontbucket.createJiraIssueFromPullRequestOnboarding.skipButtonLabel',
    description:
      'Skip button label for the create Jira issue from pull request onboarding',
    defaultMessage: 'Skip',
  },
  nextButtonLabel: {
    id: 'frontbucket.createJiraIssueFromPullRequestOnboarding.nextButtonLabel',
    description:
      'Next button label for the create Jira issue from pull request onboarding',
    defaultMessage: 'Next',
  },
  gotItButtonLabel: {
    id: 'frontbucket.createJiraIssueFromPullRequestOnboarding.gotItButtonLabel',
    description:
      '"Got it" button label for the create Jira issue from pull request onboarding',
    defaultMessage: 'Got it',
  },
  issueSummaryOnboardingMessage: {
    id:
      'frontbucket.createJiraIssueFromPullRequestOnboarding.issueSummaryOnboardingMessage',
    description: 'Onboarding message shown for issue summary field',
    defaultMessage: `It’s easier than ever to create a Jira Software issue. You can start by writing down your issue's summary.`,
  },
  issueCreationActionsOnboardingMessage: {
    id:
      'frontbucket.createJiraIssueFromPullRequestOnboarding.issueCreationActionsOnboardingMessage',
    description:
      'Onboarding message for other fields like site selector and project selector',
    defaultMessage: `Select the site and project where the issue will be created and click Create or press Enter to create the issue`,
  },
});
