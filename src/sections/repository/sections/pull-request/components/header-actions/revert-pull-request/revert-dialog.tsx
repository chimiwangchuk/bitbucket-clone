import React, { useState, useEffect } from 'react';
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl';
import { connect } from 'react-redux';

import { Label } from '@atlaskit/field-base';
// @ts-ignore TODO: fix noImplicitAny error here
import Textfield from '@atlaskit/textfield';
import Textarea from '@atlaskit/textarea';
import Modal from '@atlaskit/modal-dialog';

import commonMessages from 'src/i18n/common';
import {
  getRevertError,
  getCurrentPullRequestId,
  getCurrentPullRequestTitle,
} from 'src/redux/pull-request/selectors';
import {
  REVERT_DIALOG,
  revertPullRequest,
} from 'src/redux/pull-request/actions';

import { BucketState } from 'src/types/state';
import messages from './revert-dialog.i18n';

type Props = {
  intl: InjectedIntl;
  revertError: string | null;
  suggestedBranchName: string;
  suggestedCommitMessage: string;
  onRevert: typeof revertPullRequest;
  onClose: () => void;
};

export function RevertDialog({
  intl,
  onClose,
  onRevert,
  revertError,
  suggestedBranchName,
  suggestedCommitMessage,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [branchName, setBranchName] = useState(suggestedBranchName);
  const [commitMessage, setCommitMessage] = useState(suggestedCommitMessage);

  useEffect(() => {
    if (revertError) {
      setIsLoading(false);
      onClose();
    }
  }, [revertError, onClose]);

  const actions = [
    {
      text: intl.formatMessage(messages.revertDialogAction),
      isLoading,
      isDisabled: isLoading || !branchName,
      onClick: () => {
        setIsLoading(true);
        const targetBranchName = branchName.replace(/\s/g, '-');
        onRevert({ branchName: targetBranchName, commitMessage });
      },
    },
    {
      text: intl.formatMessage(commonMessages.close),
      onClick: onClose,
      isDisabled: isLoading,
    },
  ];

  return (
    <Modal
      heading={<FormattedMessage {...messages.revertDialogTitle} />}
      actions={actions}
      onClose={onClose}
      width="small"
      shouldCloseOnEscapePress={!isLoading}
      shouldCloseOnOverlayClick={!isLoading}
    >
      <FormattedMessage {...messages.revertDialogGuide} tagName="p" />
      <div>
        <Label
          label={intl.formatMessage(messages.revertDialogBranchName)}
          isRequired
        />
        <Textfield
          isInvalid={Boolean(revertError)}
          isDisabled={isLoading}
          value={branchName}
          // @ts-ignore TODO: fix noImplicitAny error here
          onChange={e => setBranchName(e.target.value)}
          isRequired
        />
      </div>
      <div>
        <Label label={intl.formatMessage(messages.revertDialogCommitMessage)} />
        <Textarea
          isDisabled={isLoading}
          value={commitMessage}
          onChange={e => setCommitMessage(e.target.value)}
        />
      </div>
    </Modal>
  );
}

const mapStateToProps = (state: BucketState) => {
  const id = getCurrentPullRequestId(state);
  const title = getCurrentPullRequestTitle(state);
  return {
    revertError: getRevertError(state),
    suggestedBranchName: `revert-pr-${id}`,
    suggestedCommitMessage: `Revert "${title} (pull request #${id})"`,
  };
};

// @ts-ignore TODO: fix noImplicitAny error here
const mapDispatchToProps = dispatch => ({
  // @ts-ignore TODO: fix noImplicitAny error here
  onRevert: options => dispatch(revertPullRequest(options)),
  onClose: () => dispatch({ type: REVERT_DIALOG.CLOSE }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(RevertDialog));
