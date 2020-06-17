import { defineMessages } from 'react-intl';

export default defineMessages({
  singleFileModeEnabledFlagTitle: {
    id: 'frontbucket.pullRequest.singleFileModeEnabledFlagTitle',
    description:
      'Title for the flag which tells a user the pull request is being shown in single file mode.',
    defaultMessage: 'Large pull request',
  },
  singleFileModeEnabledFlagDescription: {
    id: 'frontbucket.pullRequest.singleFileModeEnabledFlagDescription',
    description:
      'Body/description for the popup flag which tells a user the pull request is being shown in single file mode.',
    defaultMessage:
      'This pull request is too large to load and display all of the files. Files will be loaded individually.',
  },
});
