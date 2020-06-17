import { defineMessages } from 'react-intl';

export default defineMessages({
  welcomeDialogTitle: {
    id: 'frontbucket.repository.pullRequest.welcomeDialog.title',
    description: 'Onboarding modal title text',
    defaultMessage: 'Welcome to the new pull request experience',
  },
  welcomeDialogDescMain: {
    id: 'frontbucket.repository.pullRequest.welcomeDialog.descriptionMain',
    description: 'Onboarding modal main description text',
    defaultMessage:
      'Now you can find details faster with the sidebar. Also, commits are front and center, and you can display side-by-side diffs on the same page. {link}',
  },
  welcomeDialogAccept: {
    id: 'frontbucket.repository.pullRequest.welcomeDialog.accept',
    description: 'Onboarding modal accept button',
    defaultMessage: 'Start tour',
  },
  welcomeDialogReject: {
    id: 'frontbucket.repository.pullRequest.welcomeDialog.reject',
    description: 'Onboarding modal reject button',
    defaultMessage: 'Skip tour',
  },
  welcomeDialogGotIt: {
    id: 'frontbucket.repository.pullRequest.welcomeDialog.gotIt',
    description: 'Onboarding modal for mobile devices',
    defaultMessage: 'Got it',
  },
  learnMoreLink: {
    id: 'frontbucket.repository.pullRequest.welcomeDialog.learnMoreLink',
    description: 'Text for link in the main description',
    defaultMessage: 'Learn more',
  },
});
