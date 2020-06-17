import { defineMessages } from 'react-intl';

export default defineMessages({
  alertSymbol: {
    id: 'frontbucket.globalErrorBoundary.alertSymbol',
    description: 'Descriptive text for an image showing an alert symbol',
    defaultMessage: 'An alert symbol, indicating a general error.',
  },

  notice: {
    id: 'frontbucket.globalErrorBoundary.notice',
    description: 'A notice that a general error has occurred.',
    defaultMessage: 'We stumbled a bit here.',
  },

  keepsHappening: {
    id: 'frontbucket.globalErrorBoundary.keepsHappening',
    description:
      'A statement indicating what to do if an error keeps occurring.',
    defaultMessage:
      'Try again or {supportResourcesLink} if this keeps happening.',
  },

  supportResourcesLink: {
    id: 'frontbucket.globalErrorBoundary.supportResourcesLink',
    description: 'Text for a link to support resources',
    defaultMessage: 'contact support',
  },

  tryAgainButton: {
    id: 'frontbucket.globalErrorBoundary.tryAgainButton',
    description:
      'Label for a button shown during an error, which is used to reload the page',
    defaultMessage: 'Try again',
  },
});
