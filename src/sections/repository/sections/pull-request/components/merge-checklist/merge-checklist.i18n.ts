import { defineMessages } from 'react-intl';

export default defineMessages({
  mergeCheckCount: {
    id: 'frontbucket.repository.pullrequest.mergeChecklist.mergeCheckCount',
    description: 'N of M merge checks passed in the current pull request',
    defaultMessage: '{total, plural, =0 {0} other {{resolved} of {total}}}',
  },
  checksPassed: {
    id: 'frontbucket.repository.pullrequest.mergeChecklist.checksPassed',
    description: 'checks passed in the current pull request',
    defaultMessage: '{total, plural, one {check} other {checks}} passed',
  },
  zeroChecks: {
    id: 'frontbucket.repository.pullrequest.mergeChecklist.zeroChecks',
    description: 'Text for card title showing that there are no checks',
    defaultMessage: '{formattedCount} checks',
  },
  errorHeading: {
    id: 'frontbucket.repository.pullrequest.mergeChecklist.error.heading',
    description:
      'Text for error state showing that there was a problem loading merge checks',
    defaultMessage: `Couldn't load contents`,
  },
  errorAction: {
    id: 'frontbucket.repository.pullrequest.mergeChecklist.error.action',
    description:
      'Click action for error state showing that there was a problem loading the merge checks',
    defaultMessage: 'Try again',
  },
  emptyStateMessageLineOne: {
    id:
      'frontbucket.repository.pullrequest.mergeChecklist.emptyStateMessageLineOne',
    description:
      'Identifying that this branch does not have a merge checks configured',
    defaultMessage: "It looks like you don't have merge checks set up yet.",
  },
  emptyStateMessageLineTwo: {
    id:
      'frontbucket.repository.pullrequest.mergeChecklist.emptyStateMessageLineTwo',
    description: 'Description of merge checks',
    defaultMessage:
      'With merge checks, recommend or require that pull requests meet certain conditions before merging — for example, a specific number of approvals or passing builds.',
  },
  emptyStateMessageLineThree: {
    id:
      'frontbucket.repository.pullrequest.mergeChecklist.emptyStateMessageLineThree',
    description: 'Link to branch permissions page in repo settings',
    defaultMessage: '{branchPermissionsLink}',
  },
  emptyStateMessageLink: {
    id:
      'frontbucket.repository.pullrequest.mergeChecklist.emptyStateMessageLink',
    description: 'Text for link to branch permissions page in repo settings',
    defaultMessage: 'Set up merge checks',
  },
  workflowIconAltText: {
    id: 'frontbucket.repository.pullrequest.mergeChecklist.workflowIconAltText',
    description: 'Alt text for the workflow icon',
    defaultMessage: 'Simple workflow illustration',
  },
  greyIconAltText: {
    id: 'frontbucket.repository.pullrequest.mergeChecklist.greyIconAltText',
    description: 'Alt text for the grey circle icon',
    defaultMessage: 'Grey icon',
  },
});
