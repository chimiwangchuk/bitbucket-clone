import { defineMessages } from 'react-intl';

export default defineMessages({
  marketingConsentTitle: {
    id: 'frontbucket.flags.marketingConsent.title',
    description: 'Main heading of the marketing consent flag',
    defaultMessage: "Let's update your email settings",
  },
  marketingConsentDescription: {
    id: 'frontbucket.flags.marketingConsent.description',
    description: 'Explanatory text for the marketing consent flag',
    defaultMessage:
      'Would you like to receive news and offers from Atlassian about products, events, and more?',
  },
  marketingConsentButtonYes: {
    id: 'frontbucket.flags.marketingConsent.button.yes',
    description: 'Opt-in button text',
    defaultMessage: 'Yes, please',
  },
  marketingConsentButtonNo: {
    id: 'frontbucket.flags.marketingConsent.button.no',
    description: 'Opt-out button text',
    defaultMessage: 'No, thanks',
  },
  marketingConsentFailedTitle: {
    id: 'frontbucket.flags.marketingConsent.error.title',
    description: 'Heading to show if the consent submission fails',
    defaultMessage: 'Something went wrong',
  },
  marketingConsentSubmitFailedDescription: {
    id: 'frontbucket.flags.marketingConsent.error.description',
    description: 'Message to show if the consent submission fails',
    defaultMessage: 'Please try again later.',
  },
  marketingConsentSubmitFailedButton: {
    id: 'frontbucket.flags.marketingConsent.error.button',
    description: 'Button message to show if the consent submission fails',
    defaultMessage: 'OK',
  },
});
