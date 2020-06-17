import { connect } from 'react-redux';

import BaseRepository from 'src/components/repository-table';
import { getIsWorkspaceUiEnabled } from 'src/selectors/feature-selectors';
import { BucketState } from 'src/types/state';

const mapStateToProps = (state: BucketState) => ({
  isWorkspaceUiEnabled: getIsWorkspaceUiEnabled(state),
});

export default connect(mapStateToProps)(BaseRepository);
