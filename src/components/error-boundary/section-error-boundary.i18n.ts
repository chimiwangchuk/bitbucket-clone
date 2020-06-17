import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'frontbucket.sectionErrorBoundary.title',
    description: 'A title that says a runtime error has occurred.',
    defaultMessage: 'We stumbled a bit here.',
  },
  keepsHappening: {
    id: 'frontbucket.sectionErrorBoundary.keepsHappening',
    description:
      'A statement indicating what to do if an error keeps occurring.',
    defaultMessage:
      '{tryAgainLink} {or} {supportResourcesLink} {ifThisKeepsHappening}',
  },
  or: {
    id: 'frontbucket.sectionErrorBoundary.or',
    description: 'or.',
    defaultMessage: 'or',
  },
  ifThisKeepsHappening: {
    id: 'frontbucket.sectionErrorBoundary.ifThisKeepsHappening',
    description:
      'A section of sentence explaining what to do if an error keeps occuring.',
    defaultMessage: 'if this keeps happening.',
  },
  supportResourcesLink: {
    id: 'frontbucket.sectionErrorBoundary.supportResourcesLink',
    description: 'Text for a link to support resources',
    defaultMessage: 'contact support',
  },
  tryAgainLink: {
    id: 'frontbucket.sectionErrorBoundary.tryAgainLink',
    description: 'Text for a link to reload the page',
    defaultMessage: 'Reload the page',
  },
});
