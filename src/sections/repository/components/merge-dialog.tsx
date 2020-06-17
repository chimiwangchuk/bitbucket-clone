import Button from '@atlaskit/button';
import { Label } from '@atlaskit/field-base';
import { FieldTextAreaStateless } from '@atlaskit/field-text-area';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import ModalDialog from '@atlaskit/modal-dialog';
import Spinner from '@atlaskit/spinner';
import { colors } from '@atlaskit/theme';
import React, { Component, ReactNode } from 'react';
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl';

import { commonMessages } from 'src/i18n';
import { MergeForm, MergeStrategy } from 'src/types/pull-request';
import messages from './merge-dialog.i18n';
import * as styles from './merge-dialog.style';

export type MergeDialogProps = {
  actionButtonContent?: ReactNode;
  conflictUrl?: string;
  defaultCommitMessage?: string;
  defaultShouldCloseSourceBranch: boolean;
  destinationBranch?: string;
  destinationRepository?: string;
  errorMessage?: ReactNode;
  heading?: ReactNode;
  intl: InjectedIntl;
  isRequesting: boolean;
  onClose: () => void;
  onMerge: (form: MergeForm) => void;
  sourceBranch?: string;
  sourceRepository?: string;
  width?: string;
};

type MergeDialogState = {
  commitMessage: string;
  mergeStrategy: MergeStrategy;
  shouldCloseSourceBranch: boolean;
};

class MergeDialog extends Component<MergeDialogProps, MergeDialogState> {
  static defaultProps = {
    defaultShouldCloseSourceBranch: false,
    isRequesting: false,
    onClose: () => {},
    width: 'small',
  };

  state = {
    commitMessage: this.props.defaultCommitMessage || '',
    mergeStrategy: MergeStrategy.MergeCommit,
    shouldCloseSourceBranch: this.props.defaultShouldCloseSourceBranch,
  };

  submit = () => {
    const mergeInfo: MergeForm = {
      closeSourceBranch: this.state.shouldCloseSourceBranch,
      mergeStrategy: this.state.mergeStrategy,
      message: this.state.commitMessage,
    };

    this.props.onMerge(mergeInfo);
  };

  // @ts-ignore TODO: fix noImplicitAny error here
  updateCommitMessage = event => {
    this.setState({ commitMessage: event.target.value });
  };

  render() {
    const {
      actionButtonContent,
      destinationBranch,
      destinationRepository,
      errorMessage,
      heading,
      isRequesting,
      intl,
      onClose,
      sourceBranch,
      sourceRepository,
      width,
    } = this.props;

    const Footer = () => (
      <styles.MergeDialogFooter>
        <styles.MergeDialogActions>
          <styles.MergeButton
            appearance="primary"
            isDisabled={isRequesting}
            onClick={this.submit}
          >
            <styles.ButtonContent>
              {isRequesting ? (
                <styles.MergeSpinner>
                  <Spinner size="small" />
                </styles.MergeSpinner>
              ) : null}
              <styles.InnerButtonText
                data-qa="merge-dialog-merge-button"
                isDisabled={isRequesting}
              >
                {actionButtonContent || (
                  <FormattedMessage {...messages.mergePullRequestAction} />
                )}
              </styles.InnerButtonText>
            </styles.ButtonContent>
          </styles.MergeButton>
          <Button onClick={onClose} isDisabled={isRequesting}>
            <FormattedMessage {...commonMessages.cancel} />
          </Button>
        </styles.MergeDialogActions>
      </styles.MergeDialogFooter>
    );

    return (
      <ModalDialog
        heading={heading || <FormattedMessage {...messages.mergeDialogTitle} />}
        onClose={onClose}
        footer={Footer}
        width={width}
      >
        <Label label={intl.formatMessage(messages.sourceBranch)} />
        {sourceRepository && (
          <styles.RepositoryOrRef>{sourceRepository}</styles.RepositoryOrRef>
        )}
        {sourceBranch && (
          <styles.RepositoryOrRef>{sourceBranch}</styles.RepositoryOrRef>
        )}
        <Label label={intl.formatMessage(messages.destinationBranch)} />
        {destinationRepository && (
          <styles.RepositoryOrRef>
            {destinationRepository}
          </styles.RepositoryOrRef>
        )}
        {destinationBranch && (
          <styles.RepositoryOrRef>{destinationBranch}</styles.RepositoryOrRef>
        )}
        <FieldTextAreaStateless
          label={intl.formatMessage(messages.mergeDialogCommitMessageLabel)}
          minimumRows={5}
          onChange={this.updateCommitMessage}
          shouldFitContainer
          enableResize
          disabled={isRequesting}
          value={this.state.commitMessage}
        />
        {errorMessage && (
          <styles.MergeErrorMessage>
            <WarningIcon size="medium" primaryColor={colors.Y300} label="" />
            <div>{errorMessage}</div>
          </styles.MergeErrorMessage>
        )}
      </ModalDialog>
    );
  }
}

export default injectIntl(MergeDialog);
