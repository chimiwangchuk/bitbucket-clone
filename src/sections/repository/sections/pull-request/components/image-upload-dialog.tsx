import React, { PureComponent } from 'react';
// @ts-ignore TODO: fix noImplicitAny error here
import Dropzone from 'react-dropzone';
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl';
import ModalDialog, { ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { colors } from '@atlaskit/theme';

import { commonMessages } from 'src/i18n';
import { ACCEPTED_IMAGES_ATTR } from 'src/redux/pull-request/bitbucket-image-upload-handler';
import { CenteredColumn } from 'src/styles';
import {
  UploadErrorMessage,
  dropzoneStyles,
} from './image-upload-dialog.style';
import messages from './image-upload-dialog.i18n';

type ImageUploadDialogProps = {
  errorMessage: string | null | undefined;
  onClose: () => void;
  onAcceptedFileDropped: (file: any) => void;
  onRejectedFileDropped: (message: string) => void;
  intl: InjectedIntl;
};

export const ImageUploadDialog = injectIntl(
  class extends PureComponent<ImageUploadDialogProps> {
    handleFileDrop = (acceptedFiles: any[]) => {
      const { onAcceptedFileDropped, onRejectedFileDropped, intl } = this.props;

      if (acceptedFiles[0]) {
        onAcceptedFileDropped(acceptedFiles[0]);
      } else {
        onRejectedFileDropped(intl.formatMessage(messages.genericError));
      }
    };

    render() {
      const { intl, onClose, errorMessage } = this.props;

      const Header = () => (
        <ModalHeader>
          {/* very strange @emotion/styled ts issue
          //@ts-ignore */}
          <ModalTitle>
            <FormattedMessage {...messages.uploadImageTitle} />
          </ModalTitle>
        </ModalHeader>
      );

      return (
        <ModalDialog
          header={Header}
          width="small"
          onClose={onClose}
          actions={[
            {
              text: intl.formatMessage(commonMessages.cancel),
              onClick: onClose,
            },
          ]}
        >
          <CenteredColumn>
            <Dropzone
              multiple={false}
              style={dropzoneStyles}
              accept={ACCEPTED_IMAGES_ATTR}
              onDrop={this.handleFileDrop}
            >
              <FormattedMessage {...messages.uploadImageInstructions} />
            </Dropzone>
            {errorMessage && (
              <UploadErrorMessage>
                <WarningIcon
                  size="medium"
                  primaryColor={colors.Y300}
                  label={errorMessage}
                />
                {errorMessage}
              </UploadErrorMessage>
            )}
          </CenteredColumn>
        </ModalDialog>
      );
    }
  }
);
