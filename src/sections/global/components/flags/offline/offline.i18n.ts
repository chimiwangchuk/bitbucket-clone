import { defineMessages } from 'react-intl';

export default defineMessages({
  offlineTitle: {
    id: 'frontbucket.flags.network.offlineTitle',
    description: 'Text for the title of the offline message',
    defaultMessage: 'You are currently offline.',
  },
  offlineDescription: {
    id: 'frontbucket.flags.network.offlineDescription',
    description: 'Text for the description of the offline message',
    defaultMessage:
      'You can’t save any changes, but you can still review code.',
  },
  reconnectText: {
    id: 'frontbucket.flags.network.reconnectText',
    description: 'Text for the reconnect button of the offline message',
    defaultMessage: 'Try to reconnect',
  },
});
