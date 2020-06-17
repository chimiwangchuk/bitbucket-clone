import { connect } from 'react-redux';
import {
  closeCompareBranchesDialog,
  compareBranches,
  getCompareBranchesDialogSlice,
} from 'src/redux/branches';

import { BucketState } from 'src/types/state';
import SyncBranchDialog from '../components/dialogs/sync-branch-dialog';

const mapStateToProps = (state: BucketState) => {
  const {
    isOpen,
    isLoading,
    isMerge,
    sourceBranchName,
    destinationBranchName,
    sourceRepositoryFullName,
    destinationRepositoryFullName,
  } = getCompareBranchesDialogSlice(state);
  return {
    isOpen: isOpen && !isMerge,
    isLoading,
    sourceBranchName,
    destinationBranchName,
    sourceRepositoryFullName,
    destinationRepositoryFullName,
  };
};

const mapDispatchToProps = {
  onClose: closeCompareBranchesDialog,
  onAction: compareBranches,
};

export default connect(mapStateToProps, mapDispatchToProps)(SyncBranchDialog);
