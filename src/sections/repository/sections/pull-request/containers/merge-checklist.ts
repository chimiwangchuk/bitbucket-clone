import { connect } from 'react-redux';
import {
  getPullRequestMergeChecks,
  getPullRequestIsMergeable,
  getPullRequestMergeChecksLoadingState,
  getPullRequestMergeChecksError,
} from 'src/redux/pull-request/selectors';
import { BucketState, BucketDispatch } from 'src/types/state';
import {
  getCurrentRepositoryFullSlug,
  getRepositoryAccessLevel,
} from 'src/selectors/repository-selectors';
import { FETCH_MERGE_CHECKS_RETRY } from 'src/redux/pull-request/actions';
import MergeChecklist from '../components/merge-checklist/merge-checklist';

const mapStateToProps = (state: BucketState) => ({
  mergeCheckItems: getPullRequestMergeChecks(state),
  isMergeable: getPullRequestIsMergeable(state),
  repositoryFullSlug: getCurrentRepositoryFullSlug(state),
  userLevel: getRepositoryAccessLevel(state),
  isMergeChecklistLoading: getPullRequestMergeChecksLoadingState(state),
  mergeChecksError: getPullRequestMergeChecksError(state),
});

const mapDispatchToProps = (dispatch: BucketDispatch) => ({
  retryFetchMergeChecks: () => dispatch({ type: FETCH_MERGE_CHECKS_RETRY }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MergeChecklist);
