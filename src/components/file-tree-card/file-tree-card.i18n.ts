import { defineMessages } from 'react-intl';

export default defineMessages({
  label: {
    id: 'frontbucket.repository.pullrequest.fileTree.fileTreeLabel',
    description:
      'Label for a sidebar card showing a tree of folders and files.',
    defaultMessage: 'File tree',
  },
  fileCount: {
    id: 'frontbucket.repository.pullrequest.fileTree.fileCount',
    description: 'Number of changed files in the current pull request',
    defaultMessage:
      '{total, plural, one {{formattedCount} file} other {{formattedCount} files}}',
  },
  mergeConflicts: {
    id: 'frontbucket.repository.pullrequest.fileTree.mergeConflicts',
    description:
      'Tooltip description for merge conflict icon in the header of the collapsed file tree card',
    defaultMessage: 'Merge conflicts',
  },
  errorHeading: {
    id: 'frontbucket.repository.pullrequest.fileTree.errorHeading',
    description:
      'Text for error state showing that there was a problem loading the file tree',
    defaultMessage: `Couldn't load files`,
  },
  truncatedContentsMessageTitle: {
    id:
      'frontbucket.repository.pullRequest.fileTree.truncatedContentsMessageTitle',
    description:
      'Title of the message displayed below the file tree for a diff that is larger than our rendering limits allow for',
    defaultMessage: `We can't load all the files`,
  },
  truncatedContentsMessageMain: {
    id:
      'frontbucket.repository.pullRequest.fileTree.truncatedContentsMessageMain',
    description:
      'Content of the message displayed below the file tree for a diff that is larger than our rendering limits allow for',
    defaultMessage: `You can view the full diff in your local {scm} client.`,
  },
  truncatedContentsButtonText: {
    id:
      'frontbucket.repository.pullRequest.fileTree.truncatedContentsButtonText',
    description:
      'Text shown inside a button that copies a command to the clipboard when clicked',
    defaultMessage: 'Copy command',
  },
});
