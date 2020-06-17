import InlineDialog from '@atlaskit/inline-dialog';
import React, { PureComponent } from 'react';
import { CopyableTextFieldStateless } from '@atlassian/bitkit-copy';

import RefBranch from '../refs/ref-branch';
import BranchInfo from './branch-info';
import * as styles from './branch-info-dialog.styled';

export type BranchInfoDialogProps = {
  /** A URL for the branch link. */
  branchHref?: string;
  /** The name of the branch. */
  branchName: string;
  /** A URL to load the repository avatar image from. Passed through to @atlaskit/avatar. */
  repoAvatarSrc?: string;
  /** A URL for the repository link. */
  repoHref?: string;
  /** The name of the repository. */
  repoName?: string;
  /** A URL to load the repository owner avatar image from. Passed through to @atlaskit/avatar. */
  repoOwnerAvatarSrc?: string;
  /** A URL for the repository owner link. */
  repoOwnerHref?: string;
  /** The name of the repository owner. */
  repoOwnerName?: string;
  /** The source control system to generate a checkout command for. */
  scm?: 'git' | 'hg';
  /** Whether the workspace-ui feature is enabled */
  isWorkspaceUiEnabled?: boolean;
  /** Text to show inside dialog trigger, which may sometimes be different to branchName */
  description: string;
  tabIndex?: number;
};

type State = {
  isOpen: boolean;
};

export default class BranchInfoDialog extends PureComponent<
  BranchInfoDialogProps,
  State
> {
  static defaultProps: Partial<BranchInfoDialogProps> = {
    scm: 'git',
  };

  state = {
    isOpen: false,
  };

  getCheckoutCommand = () => {
    const { branchName, scm } = this.props;
    const command = scm === 'git' ? 'git checkout' : 'hg update';
    return `${command} ${branchName}`;
  };

  handleClose = () => {
    this.setState({ isOpen: false });
  };

  toggleDialog = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  render() {
    const {
      branchHref,
      branchName,
      repoOwnerAvatarSrc,
      repoOwnerHref,
      repoOwnerName,
      repoAvatarSrc,
      repoHref,
      repoName,
      isWorkspaceUiEnabled,
      description,
      tabIndex,
    } = this.props;

    const DialogContent = (
      <styles.BranchInfoDialogContent>
        <BranchInfo
          branchHref={branchHref}
          branchName={branchName}
          repoAvatarSrc={repoAvatarSrc}
          repoHref={repoHref}
          repoName={repoName}
          repoOwnerAvatarSrc={repoOwnerAvatarSrc}
          repoOwnerHref={repoOwnerHref}
          repoOwnerName={repoOwnerName}
          isWorkspaceUiEnabled={isWorkspaceUiEnabled}
        />
        <CopyableTextFieldStateless
          isReadOnly
          value={this.getCheckoutCommand()}
        />
      </styles.BranchInfoDialogContent>
    );

    return (
      <InlineDialog
        content={DialogContent}
        isOpen={this.state.isOpen}
        onClose={this.handleClose}
      >
        <styles.InlineDialogChildrenWrapper
          onClick={this.toggleDialog}
          onKeyPress={this.toggleDialog}
          role="button"
          tabIndex={tabIndex || 0}
        >
          <RefBranch name={description} />
        </styles.InlineDialogChildrenWrapper>
      </InlineDialog>
    );
  }
}
