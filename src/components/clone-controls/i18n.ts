import { defineMessages } from 'react-intl';

export default defineMessages({
  dialogHeading: {
    id: 'bitkit.cloneDialog.dialogHeading',
    description: 'Heading for clone dialog',
    defaultMessage: 'Clone this repository',
  },
  dialogCloseAction: {
    id: 'bitkit.cloneDialog.close',
    description: 'Label for clone dialog close action',
    defaultMessage: 'Close',
  },
  cloneInSourcetreeLink: {
    id: 'bitkit.cloneDialog.cloneInSourcetreeLink',
    description: 'Text for link to clone repository in Sourcetree',
    defaultMessage: 'Clone in Sourcetree',
  },
  cloneInSourcetreeMsg: {
    id: 'bitkit.cloneDialog.cloneInSourcetreeMsg',
    description: 'Text for link to clone repository in Sourcetree',
    defaultMessage: `{link} is a free Git and Mercurial client for {currentOS}.`,
  },
  cloneInXcodeLink: {
    id: 'bitkit.cloneDialog.cloneInXcodeLink',
    description: 'Text for link to clone repository in Xcode',
    defaultMessage: 'Clone in Xcode',
  },
  cloneInXcodeMsg: {
    id: 'bitkit.cloneDialog.cloneInXcodeMsg',
    description: 'Text for link to clone repository in Xcode',
    defaultMessage: `{link} is the complete IDE for Apple platforms.`,
  },
});
