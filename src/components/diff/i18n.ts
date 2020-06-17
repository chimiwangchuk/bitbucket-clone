import { defineMessages } from 'react-intl';

export default defineMessages({
  addComment: {
    id: 'bitkit.diff.addComment',
    description: 'Text associated with add comment buttons',
    defaultMessage: 'Add comment',
  },
  fromLine: {
    id: 'bitkit.diff.fromLine',
    description: 'Label indicating the original line number position of a line',
    defaultMessage: 'From line {lineNumber}',
  },
  lineAdded: {
    id: 'bitkit.diff.lineAdded.label',
    description: 'Label for an added line',
    defaultMessage: 'Added line',
  },
  lineDeleted: {
    id: 'bitkit.diff.lineDeleted.label',
    description: 'Label for a deleted line',
    defaultMessage: 'Deleted line',
  },
  lineNormal: {
    id: 'bitkit.diff.lineNormal.label',
    description: 'Label for an unchanged line',
    defaultMessage: 'Unchanged line',
  },
  showMoreIcon: {
    id: 'bitkit.diff.showMoreIcon',
    description: 'Show more lines icon',
    defaultMessage: 'Show more lines',
  },
  showMoreLines: {
    id: 'bitkit.diff.showMoreLines',
    description: 'Tooltip message for "show more lines" button',
    defaultMessage: 'Show more lines',
  },
  toLine: {
    id: 'bitkit.diff.toLine',
    description:
      'Label indicating the destination line number position of a line',
    defaultMessage: 'To line {lineNumber}',
  },
  resultPassedIcon: {
    id: 'bitkit.diff.resultPassedIcon',
    description: 'Text for passed code insights icon',
    defaultMessage: 'Passed',
  },
  resultFailedIcon: {
    id: 'bitkit.diff.resultFailedIcon',
    description: 'Text for failed code insights icon',
    defaultMessage: 'Failed',
  },
  resultSkippedIcon: {
    id: 'bitkit.diff.skippedRresultSkippedIconesultIcon',
    description: 'Text for skipped code insights icon',
    defaultMessage: 'Skipped',
  },
  resultIgnoredIcon: {
    id: 'bitkit.diff.resultIgnoredIcon',
    description: 'Text for ignored code insights icon',
    defaultMessage: 'Ignored',
  },
  severityCriticalIcon: {
    id: 'bitkit.diff.severityCriticalIcon',
    description: 'Icon text for annotation with critical severity',
    defaultMessage: 'Critical severity',
  },
  severityHighIcon: {
    id: 'bitkit.diff.severityHighIcon',
    description: 'Icon text for annotation with high severity',
    defaultMessage: 'High severity',
  },
  severityMediumIcon: {
    id: 'bitkit.diff.severityMediumIcon',
    description: 'Icon text for annotation with medium severity',
    defaultMessage: 'Medium severity',
  },
  severityLowIcon: {
    id: 'bitkit.diff.severityLowIcon',
    description: 'Icon text for annotation with low severity',
    defaultMessage: 'Low severity',
  },
  viewReport: {
    id: 'bitkit.diff.viewReport',
    description: 'Link to the full report for given annotation',
    defaultMessage: 'View report',
  },
});
