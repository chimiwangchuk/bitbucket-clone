import React, { ReactNode } from 'react';

import { Label } from '@atlaskit/field-base';
import BitbucketBranchesIcon from '@atlaskit/icon/glyph/bitbucket/branches';
import Tag from '@atlaskit/tag';
import Tooltip from '@atlaskit/tooltip';
import { FieldTextAreaStateless } from '@atlaskit/field-text-area';
import Modal from '@atlaskit/modal-dialog';

import { injectIntl, InjectedIntl, FormattedMessage } from 'react-intl';
import { gridSize } from '@atlaskit/theme';
import { getBranchesFullNames } from 'src/utils/compare-branches';
import messages from './branch-dialog.i18n';

type Props = {
  children?: ReactNode;
  height?: number;
  intl: InjectedIntl;
  isOpen: boolean;
  isLoading: boolean;
  sourceBranchName?: string;
  destinationBranchName?: string;
  sourceRepositoryFullName?: string;
  destinationRepositoryFullName?: string;
  title: FormattedMessage.MessageDescriptor;
  actionName: FormattedMessage.MessageDescriptor;
  commitMessage: string;
  isCommitMessageDisabled?: boolean;
  onClose: () => void;
  onAction: (payload: object) => void;
};

type State = {
  commitMessage: string;
  prevPropsCommitMessage?: string;
};

class BranchDialog extends React.Component<Props, State> {
  state = {
    commitMessage: '',
  };

  // @ts-ignore TODO: fix noImplicitAny error here
  static getDerivedStateFromProps(props, state) {
    if (state.prevPropsCommitMessage === props.commitMessage) {
      return null;
    }
    return {
      commitMessage: props.commitMessage,
      prevPropsCommitMessage: props.commitMessage,
    };
  }

  // @ts-ignore TODO: fix noImplicitAny error here
  handleMessageChange = e => {
    this.setState({ commitMessage: e.target.value });
  };

  getActions = () => [
    {
      text: this.props.intl.formatMessage(this.props.actionName),
      onClick: () =>
        this.props.onAction({
          commitMessage: this.state.commitMessage,
        }),
      isDisabled: this.props.isLoading,
      isLoading: this.props.isLoading,
    },
    {
      text: this.props.intl.formatMessage(messages.closeButton),
      onClick: this.props.onClose,
      isDisabled: this.props.isLoading,
    },
  ];

  render() {
    const {
      children,
      intl,
      title,
      isOpen,
      isLoading,
      sourceBranchName,
      destinationBranchName,
      sourceRepositoryFullName,
      destinationRepositoryFullName,
      isCommitMessageDisabled,
      onClose,
      height,
    } = this.props;

    if (!isOpen) {
      return null;
    }

    const fullNames = getBranchesFullNames(
      sourceBranchName,
      destinationBranchName,
      sourceRepositoryFullName,
      destinationRepositoryFullName
    );

    return (
      <Modal
        actions={this.getActions()}
        onClose={onClose}
        heading={intl.formatMessage(title)}
        shouldCloseOnEscapePress={!isLoading}
        shouldCloseOnOverlayClick={!isLoading}
        width="small"
        height={height || gridSize() * 50}
      >
        <div>
          <Label label={intl.formatMessage(messages.sourceBranch)} />
          <Tooltip content={fullNames.sourceBranchName}>
            <Tag
              text={fullNames.sourceBranchName}
              elemBefore={<BitbucketBranchesIcon size="small" label="branch" />}
            />
          </Tooltip>
        </div>

        <div>
          <Label label={intl.formatMessage(messages.destinationBranch)} />
          <Tooltip content={fullNames.destinationBranchName}>
            <Tag
              text={fullNames.destinationBranchName}
              elemBefore={<BitbucketBranchesIcon size="small" label="branch" />}
            />
          </Tooltip>
        </div>

        <div>
          <FieldTextAreaStateless
            label={intl.formatMessage(messages.commitMessageLabel)}
            minimumRows={3}
            onChange={this.handleMessageChange}
            value={this.state.commitMessage}
            shouldFitContainer
            disabled={isCommitMessageDisabled}
          />
        </div>

        {children}
      </Modal>
    );
  }
}

export default injectIntl(BranchDialog);
