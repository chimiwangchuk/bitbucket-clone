import { connect } from 'react-redux';

import { getRepositoryMirrors } from 'src/selectors/repository-selectors';
import { BucketState } from 'src/types/state';

import MirrorCloneControls from '../components/mirror-clone-controls';

const mapStateToProps = (state: BucketState) => ({
  mirrors: getRepositoryMirrors(state),
});

export default connect(mapStateToProps)(MirrorCloneControls);
