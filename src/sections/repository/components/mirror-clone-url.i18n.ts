import { defineMessages } from 'react-intl';

export default defineMessages({
  errorHeading: {
    id: 'frontbucket.repository-mirror-clone-controls.errorHeading',
    description: 'Heading for error state when a repository mirror cannot load',
    defaultMessage: `Couldn't connect to mirror`,
  },
  errorDescription: {
    id: 'frontbucket.repository-mirror-clone-controls.errorDescription',
    description:
      'Description for error state when a repository mirror cannot load',
    defaultMessage: `There was a problem loading the clone URL.\nMake sure the mirror is online and connected to this project.`,
  },
  errorLink: {
    id: 'frontbucket.repository-mirror-clone-controls.errorLink',
    description:
      'Link to view project mirroring settings when there is an error',
    defaultMessage: 'View settings',
  },
});
