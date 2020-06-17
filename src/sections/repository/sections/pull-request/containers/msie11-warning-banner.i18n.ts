import { defineMessages } from 'react-intl';

export default defineMessages({
  Msie11WarningBanner: {
    id: 'frontbucket.repository.pullRequest.Msie11WarningBanner',
    description: 'Warning banner about Internet Explorer 11 compatibility.',
    defaultMessage:
      'You may run into some issues using the new pull request view in Internet Explorer 11. ' +
      "We're aware of these issues and are working to fix them.",
  },
  Msie11WarningLinkLabel: {
    id: 'frontbucket.repository.pullRequest.Msie11WarningLinkLabel',
    description: 'Link label text to open pull request in old view.',
    defaultMessage: 'Open in old view',
  },
});
