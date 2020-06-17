import { defineMessages } from 'react-intl';

export default defineMessages({
  label: {
    id: 'frontbucket.repository.pullrequest.codeInsights.label',
    description: 'Label for a sidebar card showing code insights reports.',
    defaultMessage: 'Reports',
  },
  new: {
    id: 'frontbucket.repository.pullrequest.codeInsights.new',
    description: 'Label for new lozenge.',
    defaultMessage: 'new',
  },
  labelError: {
    id: 'frontbucket.repository.pullrequest.codeInsights.labelError',
    description: 'Label for sidebar icon with failed code insights reports.',
    defaultMessage: 'Report error',
  },
  header: {
    id: 'frontbucket.repository.pullrequest.codeInsights.header',
    description:
      'Header with number of code insights reports in a pull request',
    defaultMessage: `{total, plural, 
        one {{formattedCount} report} 
        other {{formattedCount} reports}}`,
  },
  emptyStateImage: {
    id: 'frontbucket.repository.pullrequest.codeInsights.emptyStateImage',
    description:
      'Label for image appearing when there are no code insights reports.',
    defaultMessage: 'Learn more about reports',
  },
  emptyStateMessage: {
    id: 'frontbucket.repository.pullrequest.codeInsights.emptyStateyMessage',
    description:
      'Message appearing when there are no code insights reports and pipelines are set up.',
    defaultMessage:
      'Get visibility into your code with code insights. Set up a pipe or an integration to start viewing the reports.',
  },
  learnMore: {
    id: 'frontbucket.repository.pullrequest.codeInsights.learnMore',
    description:
      'Link pointing to documentation how to set up code insights reports.',
    defaultMessage: 'Learn more',
  },
  emptyStateDiscoveryLearnMore: {
    id:
      'frontbucket.repository.pullrequest.codeInsights.emptyStateDiscoveryLearnMore',
    description:
      'Link pointing to pipes discovery dialog with pre-selected code-insights tag.',
    defaultMessage: 'Set up a pipe',
  },
  emptyStatePipelinesLearnMore: {
    id:
      'frontbucket.repository.pullrequest.codeInsights.emptyStatePipelinesLearnMore',
    description: 'Link pointing to enable pipelines.',
    defaultMessage: 'Set up a pipeline',
  },
  premiumResultIcon: {
    id: 'frontbucket.repository.pullrequest.codeInsights.premiumResultIcon',
    description: 'Text for premium code insights icon',
    defaultMessage: 'Premium',
  },
  passedResultIcon: {
    id: 'frontbucket.repository.pullrequest.codeInsights.passedResultIcon',
    description: 'Text for passed code insights icon',
    defaultMessage: 'Passed',
  },
  failedResultIcon: {
    id: 'frontbucket.repository.pullrequest.codeInsights.failedResultIcon',
    description: 'Text for failed code insights icon',
    defaultMessage: 'Failed',
  },
  pendingResultIcon: {
    id: 'frontbucket.repository.pullrequest.codeInsights.pendingResultIcon',
    description: 'Text for pending code insights icon',
    defaultMessage: 'Pending',
  },
  unknownResultIcon: {
    id: 'frontbucket.repository.pullrequest.codeInsights.unknownResultIcon',
    description: 'Text for unknown code insights icon',
    defaultMessage: 'Unknown',
  },
  skippedResultIcon: {
    id: 'frontbucket.repository.pullrequest.codeInsights.skippedResultIcon',
    description: 'Text for skipped code insights icon',
    defaultMessage: 'Skipped',
  },
  ignoredResultIcon: {
    id: 'frontbucket.repository.pullrequest.codeInsights.ignoredResultIcon',
    description: 'Text for ignored code insights icon',
    defaultMessage: 'Ignored',
  },
  modalClose: {
    id: 'frontbucket.repository.pullrequest.codeInsights.modalClose',
    description: 'Text for close modal icon',
    defaultMessage: 'Close Modal',
  },
  reporterMeta: {
    id: 'frontbucket.repository.pullrequest.codeInsights.reporterMeta',
    description: 'Text for reporter metadata',
    defaultMessage: '{reporter} reported {date}',
  },
  resultHeader: {
    id: 'frontbucket.repository.pullrequest.codeInsights.resultHeader',
    description: 'Text for result header',
    defaultMessage: 'Result',
  },
  severityHeader: {
    id: 'frontbucket.repository.pullrequest.codeInsights.severityHeader',
    description: 'Text for severity header',
    defaultMessage: 'Severity',
  },
  summaryHeader: {
    id: 'frontbucket.repository.pullrequest.codeInsights.summaryHeader',
    description: 'Text for summary header',
    defaultMessage: 'Summary',
  },
  fileHeader: {
    id: 'frontbucket.repository.pullrequest.codeInsights.fileHeader',
    description: 'Text for file header',
    defaultMessage: 'File',
  },
  totalIssues: {
    id: 'frontbucket.repository.pullrequest.codeInsights.totalIssues',
    description: 'Text for total number of issues in report.',
    defaultMessage: 'Total issues {issues}',
  },
  highSeverityIssues: {
    id: 'frontbucket.repository.pullrequest.codeInsights.highSeverityIssues',
    description: 'Text for total number of issues in report.',
    defaultMessage: 'High severity {issues}',
  },
  mediumSeverityIssues: {
    id: 'frontbucket.repository.pullrequest.codeInsights.mediumSeverityIssues',
    description: 'Text for total number of issues in report.',
    defaultMessage: 'Medium severity {issues}',
  },
  lowSeverityIssues: {
    id: 'frontbucket.repository.pullrequest.codeInsights.lowSeverityIssues',
    description: 'Text for total number of issues in report.',
    defaultMessage: 'Low severity {issues}',
  },
  collapse: {
    id: 'frontbucket.repository.pullrequest.codeInsights.collapse',
    description: 'Label for collapse annotation icon',
    defaultMessage: 'Collapse',
  },
  expand: {
    id: 'frontbucket.repository.pullrequest.codeInsights.expand',
    description: 'Label for expand annotation icon',
    defaultMessage: 'Expand',
  },
  externalLink: {
    id: 'frontbucket.repository.pullrequest.codeInsights.externalLink',
    description: 'Label for icon linking to external report',
    defaultMessage: 'Open report',
  },
  pendingReportMessage: {
    id: 'frontbucket.repository.pullrequest.codeInsights.pendingReportMessage',
    description: 'Placeholder text for when report is in PENDING state.',
    defaultMessage: 'This report is not ready. Please check back in a while.',
  },
  reportMetadataTrue: {
    id: 'frontbucket.repository.pullrequest.codeInsights.reportMetadataTrue',
    description: 'Label for truthy boolean report data value',
    defaultMessage: 'Yes',
  },
  reportMetadataFalse: {
    id: 'frontbucket.repository.pullrequest.codeInsights.reportMetadataFalse',
    description: 'Label for falsy boolean report data value',
    defaultMessage: 'No',
  },
  annotationSeverityLow: {
    id: 'frontbucket.repository.pullrequest.codeInsights.annotationSeverityLow',
    description: 'Label for annotation severity low',
    defaultMessage: 'Low',
  },
  annotationSeverityMedium: {
    id:
      'frontbucket.repository.pullrequest.codeInsights.annotationSeverityMedium',
    description: 'Label for annotation severity medium',
    defaultMessage: 'Medium',
  },
  annotationSeverityHigh: {
    id:
      'frontbucket.repository.pullrequest.codeInsights.annotationSeverityHigh',
    description: 'Label for annotation severity high',
    defaultMessage: 'High',
  },
  annotationSeverityCritical: {
    id:
      'frontbucket.repository.pullrequest.codeInsights.annotationSeverityCritical',
    description: 'Label for annotation severity critical',
    defaultMessage: 'Critical',
  },
  annotationResultPassed: {
    id:
      'frontbucket.repository.pullrequest.codeInsights.annotationResultPassed',
    description: 'Label for annotation result passed',
    defaultMessage: 'Passed',
  },
  annotationResultFailed: {
    id:
      'frontbucket.repository.pullrequest.codeInsights.annotationResultFailed',
    description: 'Label for annotation result failed',
    defaultMessage: 'Failed',
  },
  annotationResultSkipped: {
    id:
      'frontbucket.repository.pullrequest.codeInsights.annotationResultSkipped',
    description: 'Label for annotation result skipped',
    defaultMessage: 'Skipped',
  },
  annotationResultIgnored: {
    id:
      'frontbucket.repository.pullrequest.codeInsights.annotationResultIgnored',
    description: 'Label for annotation result ignored',
    defaultMessage: 'Ignored',
  },
  lockedReportIcon: {
    id: 'frontbucket.repository.pullrequest.codeInsights.lockedReportIcon',
    description: 'Icon for locked report',
    defaultMessage: 'Report locked',
  },
  lockedReportHeading: {
    id: 'frontbucket.repository.pullrequest.codeInsights.lockedReportHeading',
    description: 'Heading for locked report',
    defaultMessage: 'You’ve reached a limit of 3 free reports',
  },
  lockedReportUpgradeHeading: {
    id:
      'frontbucket.repository.pullrequest.codeInsights.lockedReportUpgradeHeading',
    description: 'Heading to upgrade to see locked reports',
    defaultMessage: 'Upgrade to view all reports',
  },
  lockedReportUpgradeMessage: {
    id:
      'frontbucket.repository.pullrequest.codeInsights.lockedReportUpgradeMessage',
    description: 'Message to upgrade to see locked reports',
    defaultMessage:
      'Upgrade to Bitbucket standard to view all reports for this pull request.',
  },
  seePlans: {
    id: 'frontbucket.repository.pullrequest.codeInsights.seePlans',
    description: 'Label on the upgrade plan button',
    defaultMessage: 'See plans',
  },
});
