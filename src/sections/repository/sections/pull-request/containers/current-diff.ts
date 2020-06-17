import { connect } from 'react-redux';
import {
  getDiffFiles,
  getIsPullRequestTruncated,
  getIsSingleFileModeActive,
} from 'src/redux/pull-request/selectors';
import { BucketState } from 'src/types/state';
import DiffLoader, { DiffLoaderProps } from '../components/diff-loader';

export const mapStateToProps = (state: BucketState): DiffLoaderProps => ({
  files: getDiffFiles(state),
  isLoading: state.repository.pullRequest.isDiffsLoading,
  isTruncated: getIsPullRequestTruncated(state),
  isSingleFileModeActive: getIsSingleFileModeActive(state),
  errorCode: state.repository.pullRequest.errorCode,
});

export default connect(mapStateToProps)(DiffLoader);
