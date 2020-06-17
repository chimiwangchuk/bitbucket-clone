import React, { Fragment, PureComponent } from 'react';
import { injectIntl, FormattedMessage, InjectedIntl } from 'react-intl';
import Modal, { ModalFooter } from '@atlaskit/modal-dialog';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';

import { publishScreenEvent } from 'src/utils/analytics/publish';
import { RepositoryPrivilege } from 'src/sections/repository/types';
import { checkUserAccess } from 'src/sections/repository/utils/check-user-access';
import { CREATE_FROM } from '../constants';
import {
  BranchType,
  BranchTypeSelector,
  CreateBranchError,
  CreateBranchParams,
  CreateFromPayload,
  JiraIssue,
  Ref,
  RefSelector,
  RepositorySelector,
  SelectOption,
  WorkflowBranches,
} from '../types';
import messages from './create-branch.i18n';
import { CreateBranchActions } from './create-branch-actions';
import { CreateBranch } from './create-branch';
import { CreateBranchForm } from './create-branch-form';
import * as styles from './create-branch.style';

export type Props = {
  intl: InjectedIntl;
  isRepoDialogOpen: boolean;
  isGlobalDialogOpen: boolean;
  isCreating: boolean;
  isDisabled: boolean;
  isBannerOpen: boolean;
  newBranchName: string;
  createParams: CreateBranchParams;
  refSelector: RefSelector;
  onCreate: (payload: CreateFromPayload) => void;
  onFetchCommitStatuses: () => void;
  onChangeFromBranch: (branch: Ref) => void;
  onChangeNewBranchName: (name: string) => void;
  branchTypeSelector: BranchTypeSelector;
  onChangeBranchType: (branchType: BranchType) => void;
  setCurrentRepository: () => void;
  setJiraIssue: (issue: JiraIssue | null) => void;
  error: CreateBranchError | null | undefined;
  workflowBranches: WorkflowBranches;
  userLevel: RepositoryPrivilege | null | undefined;
  requiredLevel: RepositoryPrivilege;
  createFrom: CREATE_FROM;
  shouldRenderCreateBranchButton: boolean;
  onChangeRepository: (payload: SelectOption) => void;
  repositorySelector: RepositorySelector;
  loadRepositories: () => void;
  openCreateBranchRepoDialog: () => void;
  openCreateBranchGlobalDialog: () => void;
  closeCreateBranchRepoDialog: () => void;
  closeCreateBranchGlobalDialog: () => void;
};

export class CreateBranchDialog extends PureComponent<Props> {
  componentDidUpdate(prevProps: Props) {
    if (
      this.props.isGlobalDialogOpen &&
      prevProps.isGlobalDialogOpen !== this.props.isGlobalDialogOpen
    ) {
      publishScreenEvent('globalCreateBranchDialog');
      this.props.loadRepositories();
    }

    if (
      this.props.isRepoDialogOpen &&
      prevProps.isRepoDialogOpen !== this.props.isRepoDialogOpen
    ) {
      publishScreenEvent('createBranchDialog');
      this.props.setCurrentRepository();
    }
  }

  handleCreate = () => {
    this.props.onCreate({
      createFrom: this.props.createFrom,
    });
  };

  isOpen = () => {
    const { createFrom, isRepoDialogOpen, isGlobalDialogOpen } = this.props;

    if (createFrom === CREATE_FROM.REPO_DIALOG) {
      return isRepoDialogOpen;
    } else if (createFrom === CREATE_FROM.GLOBAL_DIALOG) {
      return isGlobalDialogOpen;
    }

    return false;
  };

  handleCloseDialog = () => {
    const {
      createFrom,
      closeCreateBranchGlobalDialog,
      closeCreateBranchRepoDialog,
    } = this.props;
    if (createFrom === CREATE_FROM.GLOBAL_DIALOG) {
      closeCreateBranchGlobalDialog();
    } else if (createFrom === CREATE_FROM.REPO_DIALOG) {
      closeCreateBranchRepoDialog();
    }
  };

  handleOpenDialog = () => {
    const {
      createFrom,
      openCreateBranchGlobalDialog,
      openCreateBranchRepoDialog,
    } = this.props;
    if (createFrom === CREATE_FROM.GLOBAL_DIALOG) {
      openCreateBranchGlobalDialog();
    } else if (createFrom === CREATE_FROM.REPO_DIALOG) {
      openCreateBranchRepoDialog();
    }
  };

  renderModal = () => {
    const {
      intl,
      isCreating,
      isBannerOpen,
      refSelector,
      createParams,
      newBranchName,
      onChangeFromBranch,
      onChangeNewBranchName,
      onFetchCommitStatuses,
      branchTypeSelector,
      onChangeBranchType,
      error,
      workflowBranches,
      createFrom,
      onChangeRepository,
      repositorySelector,
    } = this.props;

    return (
      <Modal
        footer={this.renderFooter}
        onClose={this.handleCloseDialog}
        heading={<FormattedMessage {...messages.title} />}
        shouldCloseOnEscapePress={!isCreating}
        shouldCloseOnOverlayClick={!isCreating}
      >
        <CreateBranchForm>
          <CreateBranch
            intl={intl}
            isCreating={isCreating}
            refSelector={refSelector}
            createParams={createParams}
            newBranchName={newBranchName}
            workflowBranches={workflowBranches}
            onFetchCommitStatuses={onFetchCommitStatuses}
            branchTypeSelector={branchTypeSelector}
            onChangeBranchType={onChangeBranchType}
            onChangeFromBranch={onChangeFromBranch}
            onChangeNewBranchName={onChangeNewBranchName}
            error={error}
            isBannerOpen={isBannerOpen}
            createFrom={createFrom}
            onChangeRepository={onChangeRepository}
            repositorySelector={repositorySelector}
          />
        </CreateBranchForm>
      </Modal>
    );
  };

  renderFooter = () => {
    const { isCreating, isDisabled } = this.props;

    return (
      <ModalFooter>
        <styles.FooterContent>
          <CreateBranchActions
            isLoading={isCreating}
            onCreate={this.handleCreate}
            onCancel={this.handleCloseDialog}
            isSaveDisabled={isDisabled}
            isCancelDisabled={isCreating}
          />
        </styles.FooterContent>
      </ModalFooter>
    );
  };

  renderCreateBranchButton = () => {
    const { userLevel, requiredLevel } = this.props;
    const userHasAccess = checkUserAccess({ userLevel, requiredLevel });

    return userHasAccess ? (
      <Button onClick={this.handleOpenDialog} id="open-create-branch-modal">
        <FormattedMessage {...messages.createBranchButton} />
      </Button>
    ) : (
      <Tooltip
        content={<FormattedMessage {...messages.createBranchButtonDisabled} />}
      >
        <Button
          onClick={this.handleOpenDialog}
          isDisabled
          id="open-create-branch-modal"
        >
          <FormattedMessage {...messages.createBranchButton} />
        </Button>
      </Tooltip>
    );
  };

  render() {
    const { shouldRenderCreateBranchButton } = this.props;

    return (
      <Fragment>
        {/* When opened in global context we handle the display of the trigger button */}
        {shouldRenderCreateBranchButton && this.renderCreateBranchButton()}
        {this.isOpen() && this.renderModal()}
      </Fragment>
    );
  }
}

export default injectIntl(CreateBranchDialog);
