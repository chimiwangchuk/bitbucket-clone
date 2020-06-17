import { defineMessages } from 'react-intl';

export default defineMessages({
  gotItButton: {
    id: 'frontbucket.flags.ieMessage.dismiss',
    description: 'Label to be shown on the button to dismiss the message',
    defaultMessage: 'Got it',
  },
  learnMoreButton: {
    id: 'frontbucket.flags.ieMessage.learnMore',
    description: 'Label to be shown on the button linking to more information',
    defaultMessage: 'Learn more',
  },
  phaseTwoTitle: {
    id: 'frontbucket.flags.ieMessage.phase.two.title',
    description:
      'Title of the message shown *after* IE11 is no longer supported',
    defaultMessage: 'Bitbucket no longer supports IE11',
  },
  phaseTwoContent: {
    id: 'frontbucket.flags.ieMessage.phase.two.content',
    description:
      'Content of the message shown *after* IE11 is no longer supported',
    defaultMessage: 'We recommend you switch to one of our supported browsers.',
  },
});
