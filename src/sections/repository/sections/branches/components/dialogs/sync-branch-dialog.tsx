import React from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';

import { getBranchesFullNames } from 'src/utils/compare-branches';
import BranchDialog from './branch-dialog';
import messages from './sync-branch-dialog.i18n';

type Props = {
  intl: InjectedIntl;
  isOpen: boolean;
  isLoading: boolean;
  sourceBranchName?: string;
  destinationBranchName?: string;
  sourceRepositoryFullName: string;
  destinationRepositoryFullName: string;
  onClose: () => void;
  onAction: (payload: object) => void;
};

class SyncBranchDialog extends React.Component<Props> {
  getCommitMessage() {
    const {
      sourceBranchName,
      destinationBranchName,
      sourceRepositoryFullName,
      destinationRepositoryFullName,
      intl,
    } = this.props;

    if (sourceBranchName && destinationBranchName) {
      const fullNames = getBranchesFullNames(
        sourceBranchName,
        destinationBranchName,
        sourceRepositoryFullName,
        destinationRepositoryFullName
      );

      return intl.formatMessage(messages.commitMessage, fullNames);
    }
    return '';
  }

  render() {
    return (
      <BranchDialog
        {...this.props}
        title={messages.dialogTitle}
        actionName={messages.actionName}
        commitMessage={this.getCommitMessage()}
      />
    );
  }
}

export default injectIntl(SyncBranchDialog);
