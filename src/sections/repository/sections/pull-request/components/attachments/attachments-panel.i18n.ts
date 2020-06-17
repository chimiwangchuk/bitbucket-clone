import { defineMessages } from 'react-intl';

export default defineMessages({
  attachmentListLabel: {
    id: 'frontbucket.repository.pullrequest.attachmentListLabel',
    description: 'Label for a list of attachments for a pull request',
    defaultMessage: 'Attachment list',
  },
  // This can represent:
  //  "0 attachments"
  //  "1 attachment"
  //  "{X} attachments"
  //  "Attachments" (if error)
  attachmentPanelHeader: {
    id: 'frontbucket.repository.pullrequest.attachmentPanelHeader',
    description: 'Header with number of attachments in a pull request',
    defaultMessage: `
      {hasError, select,
        true {Attachments}
        other {{count, plural,
          one {{count} attachment}
          other {{count} attachments}
        }}
      }`,
  },
  loadAttachmentsGenericError: {
    id: 'frontbucket.repository.pullrequest.loadAttachmentsGenericError',
    description:
      'Generic text explaining that we could not load the pull request attachments',
    defaultMessage: "Couldn't load attachments",
  },
  openPopupBtn: {
    id: 'frontbucket.repository.pullrequest.attachments.openPicker.link',
    description: 'button link to open media-viewer to select attachments',
    defaultMessage: 'Browse to upload',
  },
  successFlag: {
    id: 'frontbucket.repository.pullrequest.attachments.flag.success',
    description:
      'flag text when request to add attachments to a PR is successful',
    defaultMessage: 'Successfully added attachments.',
  },
  errorFlag: {
    id: 'frontbucket.repository.pullrequest.attachments.flag.error',
    description: 'flag text when request to add attachments to a PR fails',
    defaultMessage: 'Unable to add attachments. Please try again later.',
  },
});
