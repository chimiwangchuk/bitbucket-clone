import { defineMessages } from 'react-intl';

export default defineMessages({
  authorHeader: {
    id: 'bitkit.commitList.authorHeader',
    description: 'Table header for the commit author column',
    defaultMessage: 'Author',
  },
  buildsHeader: {
    id: 'bitkit.commitList.buildsHeader',
    description: 'Table header for the commit builds column',
    defaultMessage: 'Builds',
  },
  dateHeader: {
    id: 'bitkit.commitList.dateHeader',
    description: 'Table header for the commit date column',
    defaultMessage: 'Date',
  },
  hashHeader: {
    id: 'bitkit.commitList.hashHeader',
    description: 'Table header for the commit hash column',
    defaultMessage: 'Commit',
  },
  mergeCommitTooltip: {
    id: 'bitkit.commitList.mergeCommitTooltip',
    description: 'Tooltip text for the merge commit lozenge',
    defaultMessage: 'This commit is a merge.',
  },
  summaryHeader: {
    id: 'bitkit.commitList.summaryHeader',
    description: 'Table header for the commit summary column',
    defaultMessage: 'Summary',
  },
  messageHeader: {
    id: 'bitkit.commitList.messageHeader',
    description: 'Table header for the commit message column',
    defaultMessage: 'Message',
  },
  showMoreCommits: {
    id: 'bitkit.commitList.showMoreCommits',
    description:
      'Link text to show additional commits that have been visually hidden in the commit list of a pull request',
    defaultMessage: 'Show more',
  },
  showFullDiff: {
    id: 'bitkit.commitList.showFullDiff',
    description:
      'Text for option to display the diff of a full range of commits in a pull request',
    defaultMessage: 'See all commits',
  },
  noCommits: {
    id: 'bitkit.commitList.noCommits',
    description:
      'Text to inform the user that this pull request has no commits',
    defaultMessage: 'No commits available',
  },
  commentLabel: {
    id: 'bitkit.commitList.commentLabel',
    description: 'Label for commit comment icon',
    defaultMessage: 'Comment',
  },
  summaryInfo: {
    id: 'bitkit.commitList.summaryInfo',
    description: 'Text describing the basic information about a commit',
    defaultMessage: '{author} - {id}, {date}',
  },
});
