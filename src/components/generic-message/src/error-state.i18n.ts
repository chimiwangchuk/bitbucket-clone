import { defineMessages } from 'react-intl';

export default defineMessages({
  errorHeader: {
    id: 'frontbucket.errorState.errorHeader',
    description: 'Text for the header of the error when data fail to load',
    defaultMessage: 'Something went wrong...',
  },
  errorDescription: {
    id: 'frontbucket.errorState.errorDescription',
    description: 'Text for the description of the error when data fail to load',
    defaultMessage:
      'While we check things on our end, contact support if the problem persists.',
  },
  errorLink: {
    id: 'frontbucket.errorState.link',
    description:
      'Label for a link shown during an error, which is used to reload the page',
    defaultMessage: 'Try again',
  },
});
