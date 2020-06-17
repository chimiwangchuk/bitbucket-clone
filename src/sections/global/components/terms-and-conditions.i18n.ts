import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'frontbucket.modals.termsAndConditions.title',
    description: 'Explanatory text for the terms and conditions modal',
    defaultMessage: 'We’ve updated our terms of service',
  },
  // This message should stay in-sync with changes to TOS
  description: {
    id: 'frontbucket.modals.termsAndConditions.description',
    description:
      'Description for the terms and conditions modal "{termLink}" is a link to our the terms of service page',
    defaultMessage:
      'As we grow, we occasionally need to update our terms of service. To keep using Bitbucket Cloud, review and agree to the updated {termsLink}. To learn more, please see our {summaryLink}.',
  },
  link: {
    id: 'frontbucket.modals.termsAndConditions.link',
    description: 'Text used for a link to the terms of service page',
    defaultMessage: 'terms',
  },
  summaryLink: {
    id: 'frontbucket.modals.termsAndConditions.summaryLink',
    description: 'Text used for a link to the summary page',
    defaultMessage: 'Summary of Changes',
  },
  agree: {
    id: 'frontbucket.modals.termsAndConditions.agree',
    description: 'Agree to terms and conditions',
    defaultMessage: 'Agree',
  },
  remindMeLater: {
    id: 'frontbucket.modals.termsAndConditions.remindMeLater',
    description: 'Dismisses message for 72 hours',
    defaultMessage: 'Not now',
  },
});
