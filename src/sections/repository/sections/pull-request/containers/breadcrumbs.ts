import { connect } from 'react-redux';
import { getCurrentRepository } from 'src/selectors/repository-selectors';

import { BucketState } from 'src/types/state';
import Breadcrumbs from '../components/breadcrumbs';

const mapStateToProps = (state: BucketState) => {
  const repository = getCurrentRepository(state);
  return { repository };
};

export default connect(mapStateToProps)(Breadcrumbs);
