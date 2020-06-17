import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';
import { Repository } from 'src/components/types';

import sourceUrls from 'src/urls/source';

import { MergeForm } from 'src/types/pull-request';
import urls from '../urls';
import merge from '../utils/merge';
import MergeDialog, { MergeDialogProps } from './merge-dialog';
import messages from './sync-dialog.i18n';

type Props = RouteComponentProps & {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (repository: Repository, repositoryParent: Repository) => void;
  repository?: Repository;
  repositoryParent?: Repository;
};

type State = {
  errorMessage: string | null | undefined;
  hasConflicts: boolean;
  hasError: boolean;
  isRequesting: boolean;
};

export default class SyncDialog extends Component<Props, State> {
  static defaultProps = {
    isOpen: false,
    onClose: () => {},
    onMerge: () => {},
    onSuccess: () => {},
  };

  state = {
    errorMessage: null,
    hasConflicts: false,
    hasError: false,
    isRequesting: false,
  };

  handleMerge = (form: MergeForm) => {
    this.syncRepositories(form);
  };

  handleSuccess = (repository: Repository, repositoryParent: Repository) => {
    this.props.onSuccess(repository, repositoryParent);
    this.props.onClose();
  };

  syncRepositories = async (form: MergeForm) => {
    try {
      const { repository, repositoryParent } = this.props;

      if (
        !repository ||
        !repositoryParent ||
        repository.mainbranch === undefined ||
        repositoryParent.mainbranch === undefined
      ) {
        return;
      }

      this.setState({ isRequesting: true });

      const task = await merge({
        form,
        parentFullName: repositoryParent.full_name,
        parentMainBranch: repositoryParent.mainbranch.name,
        repositoryFullName: repository.full_name,
        repositoryMainBranch: repository.mainbranch.name,
      });

      if (task.conflicts) {
        this.setState({
          errorMessage: null,
          hasConflicts: true,
          hasError: true,
          isRequesting: false,
        });
        return;
      }

      this.setState({
        errorMessage: null,
        hasConflicts: false,
        hasError: false,
        isRequesting: false,
      });

      if (task.url) {
        const hash = task.url
          .split('/')
          .filter(part => !!part)
          .pop();

        this.props.history.push(
          sourceUrls.ui.source(repository.full_name, {
            refOrHash: hash,
            at: repository.mainbranch.name,
          })
        );
      }

      this.handleSuccess(repository, repositoryParent);
    } catch (e) {
      this.setState({
        errorMessage: e.message,
        hasConflicts: false,
        hasError: true,
        isRequesting: false,
      });
    }
  };

  render() {
    const { isOpen, onClose, repository, repositoryParent } = this.props;
    const { errorMessage, hasConflicts, hasError, isRequesting } = this.state;

    if (!isOpen) {
      return null;
    }

    const props = {} as MergeDialogProps;

    if (
      repository &&
      repositoryParent &&
      repository.mainbranch !== undefined &&
      repositoryParent.mainbranch !== undefined
    ) {
      const destinationBranch = repository.mainbranch.name;
      const destinationRepository = repository.full_name;
      const sourceBranch = repositoryParent.mainbranch.name;
      const sourceRepository = repositoryParent.full_name;

      const commitMessageSource =
        sourceBranch !== destinationBranch
          ? `${sourceRepository}:${sourceBranch}`
          : sourceRepository;

      const [owner, slug] = destinationRepository.split('/');

      props.conflictUrl = `${urls.ui.branches(
        owner,
        slug
      )}/compare/${sourceRepository}..#diff`;
      props.defaultCommitMessage = `Merged ${commitMessageSource} into ${destinationBranch}`;
      props.destinationBranch = destinationBranch;
      props.destinationRepository = destinationRepository;
      props.sourceBranch = sourceBranch;
      props.sourceRepository = sourceRepository;
    }

    if (hasError) {
      props.errorMessage = errorMessage;

      if (!props.errorMessage && hasConflicts && props.conflictUrl) {
        props.errorMessage = (
          <FormattedMessage
            {...messages.mergeConflictError}
            values={{
              viewConflictLink: (
                <a href={props.conflictUrl} target="_blank">
                  <FormattedMessage {...messages.viewConflictLink} />
                </a>
              ),
            }}
          />
        );
      }

      if (!props.errorMessage) {
        props.errorMessage = <FormattedMessage {...messages.mergeError} />;
      }
    }

    return (
      <MergeDialog
        {...props}
        actionButtonContent={<FormattedMessage {...messages.syncButton} />}
        heading={<FormattedMessage {...messages.heading} />}
        isRequesting={isRequesting}
        onClose={onClose}
        onMerge={this.handleMerge}
        width="medium"
      />
    );
  }
}
