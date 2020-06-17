import { defineMessages } from 'react-intl';

export default defineMessages({
  buildDialogCloseButton: {
    id: 'bitkit.builds.buildDialogCloseButton',
    description: 'Text for close build dialog button',
    defaultMessage: 'Close',
  },
  tooltipFailedStatus: {
    id: 'bitkit.builds.tooltipFailed',
    description: 'Text for tooltip showing how many builds are failed',
    defaultMessage: '{count, number} of {total} failed',
  },
  tooltipPassedStatus: {
    id: 'bitkit.builds.tooltipSuccess',
    description: 'Text for tooltip showing how many builds are passed',
    defaultMessage: '{count, number} of {total} passed',
  },
  successfulStatusIcon: {
    id: 'bitkit.builds.successfulIcon',
    description: 'Text for build success icon',
    defaultMessage: 'Successful',
  },
  stoppedStatusIcon: {
    id: 'bitkit.builds.stoppedIcon',
    description: 'Text for build stopped icon',
    defaultMessage: 'Stopped',
  },
  failedStatusIcon: {
    id: 'bitkit.builds.failedIcon',
    description: 'Text for build failed icon',
    defaultMessage: 'Failed',
  },
  inProgressStatusIcon: {
    id: 'bitkit.builds.inProgressIcon',
    description: 'Text for build in progress icon',
    defaultMessage: 'In progress',
  },
  buildSummaryDialogHeading: {
    id: 'bitkit.builds.buildSummaryDialogHeading',
    description: 'Text for build summary dialog header',
    defaultMessage: 'Builds',
  },
});
