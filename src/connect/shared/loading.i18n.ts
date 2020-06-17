import { defineMessages } from 'react-intl';

export default defineMessages({
  loading: {
    id: 'frontbucket.connect.loadingDescription',
    description: 'Description for connect loading state',
    defaultMessage: 'Loading app {link}.',
  },
  timeout: {
    id: 'frontbucket.connect.loadingTimeoutDescription',
    description: 'Description for connect loading timeout state',
    defaultMessage: 'App {link} is not responding. Wait or {action}.',
  },
  failed: {
    id: 'frontbucket.connect.loadingFailedDescription',
    description: 'Description for connect loading failed state',
    defaultMessage: 'App {link} failed to load.',
  },
  cancelText: {
    id: 'frontbucket.connect.cancelText',
    description: 'Connect timeout cancel action',
    defaultMessage: 'cancel',
  },
});
