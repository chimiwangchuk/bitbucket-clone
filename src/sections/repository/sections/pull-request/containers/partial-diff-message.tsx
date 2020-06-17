import { connect } from 'react-redux';

import {
  getPullRequestSourceHash,
  getPullRequestDestinationHash,
} from 'src/redux/pull-request/selectors';

import { getCurrentRepositoryScm } from 'src/selectors/repository-selectors';
import { BucketState } from 'src/types/state';

import PartialDiffMessage from '../components/partial-diff-message';

const mapStateToProps = (state: BucketState) => ({
  featureBranchHash: getPullRequestSourceHash(state),
  scm: getCurrentRepositoryScm(state),
  targetBranchHash: getPullRequestDestinationHash(state),
});

export default connect(mapStateToProps)(PartialDiffMessage);
