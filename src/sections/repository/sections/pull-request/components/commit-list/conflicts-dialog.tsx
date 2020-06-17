import React from 'react';

import Modal from '@atlaskit/modal-dialog';
import { AkCodeBlock } from '@atlaskit/code';

import { injectIntl, FormattedMessage, InjectedIntl } from 'react-intl';
import { getBranchesFullNames } from 'src/utils/compare-branches';
import messages from './conflicts-dialog.i18n';

type Props = {
  intl: InjectedIntl;
  isOpen: boolean;
  sourceBranchName: string;
  destinationBranchName: string;
  sourceRepositoryFullName: string;
  destinationRepositoryFullName: string;
  destinationHash: string;
  sourceHash: string;
  sourceCloneLink: string;
  scm: 'git' | 'hg';
  onClose: () => void;
};

class ConflictsDialog extends React.Component<Props> {
  getActions = () => [
    {
      text: this.props.intl.formatMessage(messages.closeConflictsDialogButton),
      onClick: this.props.onClose,
    },
  ];

  getGitSyncCode = () => {
    const {
      intl,
      sourceBranchName,
      destinationHash,
      sourceRepositoryFullName,
      destinationRepositoryFullName,
      sourceCloneLink,
    } = this.props;
    const lines = [`git checkout ${destinationHash.substr(0, 7)}`];

    let remote = 'origin';
    if (sourceRepositoryFullName !== destinationRepositoryFullName) {
      remote = sourceRepositoryFullName;
      lines.push(
        `git remote add ${remote} ${sourceCloneLink}`,
        `git fetch ${remote}`
      );
    }

    lines.push(
      `# ${intl.formatMessage(messages.conflictsDialogWarning)}`,
      `git merge remotes/${remote}/${sourceBranchName}`
    );

    return lines.join('\n');
  };

  getHgSyncCode = () => {
    const {
      sourceHash,
      destinationHash,
      sourceRepositoryFullName,
      destinationRepositoryFullName,
      sourceCloneLink,
    } = this.props;
    const lines = [`hg update ${destinationHash.substr(0, 7)}`];

    if (sourceRepositoryFullName !== destinationRepositoryFullName) {
      lines.push(`hg pull -r ${sourceHash.substr(0, 7)} ${sourceCloneLink}`);
    }

    lines.push(`hg merge ${sourceHash.substr(0, 7)}`);

    return lines.join('\n');
  };

  getSyncCode = () => {
    if (this.props.scm === 'hg') {
      return this.getHgSyncCode();
    }
    return this.getGitSyncCode();
  };

  render() {
    const {
      intl,
      isOpen,
      onClose,
      sourceBranchName,
      destinationBranchName,
      sourceRepositoryFullName,
      destinationRepositoryFullName,
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
        appearance="warning"
        actions={this.getActions()}
        onClose={onClose}
        heading={intl.formatMessage(messages.conflictsDialogTitle)}
        shouldCloseOnEscapePress
        shouldCloseOnOverlayClick
      >
        <FormattedMessage {...messages.conflictsDialogMessage} tagName="p" />
        <FormattedMessage
          {...messages.conflictsDialogInstruction}
          values={{
            branch: fullNames.destinationBranchName,
          }}
          tagName="p"
        />
        <p>
          <AkCodeBlock text={this.getSyncCode()} />
        </p>
      </Modal>
    );
  }
}

export default injectIntl(ConflictsDialog);
