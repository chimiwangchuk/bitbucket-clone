import { defineMessages } from 'react-intl';

export default defineMessages({
  label: {
    id: 'repository.buildStatus.label',
    description: 'Label for a sidebar card showing a list of build statuses.',
    defaultMessage: 'Build statuses',
  },

  failedStatus: {
    id: 'repository.buildStatus.tooltipFailed',
    description: 'Text for card title showing how many builds are failed',
    defaultMessage:
      '{total, plural, one {{formattedCount} build failed} other {{formattedCount} builds failed}}',
  },

  passedStatus: {
    id: 'repository.buildStatus.tooltipSuccess',
    description: 'Text for card title showing how many builds are passed',
    defaultMessage:
      '{total, plural, one {{formattedCount} build passed} other {{formattedCount} builds passed}}',
  },

  zeroBuilds: {
    id: 'repository.buildStatus.zeroBuilds',
    description: 'Text for card title showing that there are no builds',
    defaultMessage: '{formattedCount} builds',
  },
  errorHeading: {
    id: 'repository.buildStatus.error.heading',
    description:
      'Text for error state showing that there was a problem loading the builds',
    defaultMessage: `Couldn't load contents`,
  },
  errorAction: {
    id: 'repository.buildStatus.error.action',
    description:
      'Click action for error state showing that there was a problem loading the builds',
    defaultMessage: 'Try again',
  },
});
