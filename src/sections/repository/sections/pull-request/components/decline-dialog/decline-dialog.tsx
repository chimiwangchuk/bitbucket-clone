import React, { Component } from 'react';
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { colors } from '@atlaskit/theme';
import ModalDialog from '@atlaskit/modal-dialog';
import Spinner from '@atlaskit/spinner';
import Button from '@atlaskit/button';
import FieldTextArea from '@atlaskit/field-text-area';

import { commonMessages } from 'src/i18n';
import messages from '../../components/header-actions/header-actions.i18n';

import * as styles from './decline-dialog.style';

type DeclineDialogProps = {
  isErrored: boolean;
  isRequesting: boolean;
  errorMessage: string | null | undefined;
  onClose: () => void;
  declinePullRequest: (reason: string) => void;
  intl: InjectedIntl;
};

type DeclineDialogState = {
  reason: string;
};

class DeclineDialog extends Component<DeclineDialogProps, DeclineDialogState> {
  state = {
    reason: '',
  };

  submit = () => {
    this.props.declinePullRequest(this.state.reason);
  };

  // @ts-ignore TODO: fix noImplicitAny error here
  updateReason = event => {
    this.setState({ reason: event.target.value });
  };

  render() {
    const { intl, onClose, isRequesting, isErrored, errorMessage } = this.props;

    const Footer = () => (
      <styles.DeclineDialogFooter>
        <styles.DeclineButton
          appearance="primary"
          isDisabled={isRequesting}
          onClick={this.submit}
        >
          <styles.ButtonContent>
            {isRequesting ? (
              <styles.DeclineSpinner>
                <Spinner size="small" />
              </styles.DeclineSpinner>
            ) : null}
            <styles.InnerButtonText isDisabled={isRequesting}>
              <FormattedMessage {...messages.declinePullRequestAction} />
            </styles.InnerButtonText>
          </styles.ButtonContent>
        </styles.DeclineButton>
        <Button onClick={onClose}>
          <FormattedMessage {...commonMessages.cancel} />
        </Button>
      </styles.DeclineDialogFooter>
    );

    return (
      <ModalDialog
        heading={<FormattedMessage {...messages.declineDialogTitle} />}
        onClose={onClose}
        footer={Footer}
      >
        <FormattedMessage {...messages.declineDialogInfo} />
        <FieldTextArea
          autoFocus
          label={intl.formatMessage(messages.declineDialogLabel)}
          shouldFitContainer
          onChange={this.updateReason}
        />
        {isErrored && (
          <styles.DeclineErrorMessage>
            <WarningIcon
              size="medium"
              primaryColor={colors.Y300}
              label={errorMessage || ''}
            />
            {errorMessage}
          </styles.DeclineErrorMessage>
        )}
      </ModalDialog>
    );
  }
}

export default injectIntl(DeclineDialog);
