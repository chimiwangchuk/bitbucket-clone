import { defineMessages } from 'react-intl';

export default defineMessages({
  annotationsLabel: {
    id: 'frontbucket.source.annotations.label',
    description: 'Annotations heading',
    defaultMessage: 'Annotations',
  },
  infoCount: {
    id: 'frontbucket.source.annotations.infoCount',
    description: `The number of annotations found with info severity`,
    defaultMessage: '{count} info',
  },
  warningCount: {
    id: 'frontbucket.source.annotations.warningCount',
    description: `The number of annotations found with warning severity`,
    defaultMessage: '{count} warnings',
  },
  errorCount: {
    id: 'frontbucket.source.annotations.errorCount',
    description: `The number of annotations found with error severity`,
    defaultMessage: '{count} errors',
  },
  fileCountLabel: {
    id: 'frontbucket.source.annotations.fileCount',
    description: `A label showing how many files are in scope`,
    defaultMessage: '{count} files',
  },
  allFilesLabel: {
    id: 'frontbucket.source.annotations.allFiles',
    description: `A label shown when all of the files are in scope`,
    defaultMessage: 'all files',
  },
});
