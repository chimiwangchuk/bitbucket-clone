import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Repository } from 'src/components/types';

import { showFlag } from 'src/redux/flags';
import {
  getCurrentRepository,
  getRepositoryDetails,
  isSyncDialogOpen,
} from 'src/selectors/repository-selectors';
import { BucketState, BucketDispatch } from 'src/types/state';

import fetchRepositoryDetails from '../actions/fetch-repository-details';
import toggleSyncDialog from '../actions/toggle-sync-dialog';
import SyncDialog from '../components/sync-dialog';
import messages from '../components/sync-dialog.i18n';

const mapStateToProps = (state: BucketState) => ({
  repository: getCurrentRepository(state),
  repositoryParent: getRepositoryDetails(state).parent,
  isOpen: isSyncDialogOpen(state),
});

const mapDispatchToProps = (dispatch: BucketDispatch) => ({
  onClose: () => dispatch(toggleSyncDialog(false)),
  onSuccess: (repository: Repository, repositoryParent: Repository) => {
    dispatch(
      showFlag({
        id: 'fork-sync-success',
        iconType: 'success',
        title: { msg: messages.successFlagTitle },
        description: {
          msg: messages.successFlagDescription,
          values: {
            repositoryName: repository.full_name,
            repositoryParentName: repositoryParent.full_name,
          },
        },
      })
    );

    dispatch(fetchRepositoryDetails(repository.full_name));
  },
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SyncDialog)
);
