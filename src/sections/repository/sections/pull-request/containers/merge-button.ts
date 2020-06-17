import { connect } from 'react-redux';
import { BucketState } from 'src/types/state';
import {
  getIsMergePending,
  getIsAsyncMergeInProgress,
  openDialog,
} from 'src/redux/pull-request/merge-reducer';

import { getPullRequestIsMergeable } from 'src/redux/pull-request/selectors';
import MergeButton from '../components/merge-button';

const mapStateToProps = (state: BucketState) => ({
  isMergePending: getIsMergePending(state),
  isAsyncMergeInProgress: getIsAsyncMergeInProgress(state),
  isMergeable: getPullRequestIsMergeable(state),
  hasMergeChecklistFeature:
    state.global.features['new-code-review-merge-checklist'],
});

const mapDispatchToProps = { onClick: openDialog };

export default connect(mapStateToProps, mapDispatchToProps)(MergeButton);
