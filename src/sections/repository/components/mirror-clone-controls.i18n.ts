import { defineMessages } from 'react-intl';

export default defineMessages({
  heading: {
    id: 'frontbucket.repository-mirror-clone-controls.heading',
    description: 'Label for the repository mirror clone controls',
    defaultMessage: 'Mirrors',
  },
  infoLabel: {
    id: 'frontbucket.repository-mirror-clone-controls.infoLabel',
    description: 'Label that explains that repository mirrors are read-only',
    defaultMessage: 'Mirrors are read-only',
  },
  infoDescription: {
    id: 'frontbucket.repository-mirror-clone-controls.infoDescription',
    description: 'Instructions to update your repository push URL',
    defaultMessage: 'You may need to {link} after cloning a mirror:',
  },
  infoDescriptionLinkText: {
    id: 'frontbucket.repository-mirror-clone-controls.infoDescriptionLinkText',
    description:
      'Text for link to online documentation about updating repository push URL',
    defaultMessage: 'update your push URL',
  },
});
