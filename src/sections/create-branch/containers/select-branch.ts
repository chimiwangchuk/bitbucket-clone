import { connect } from 'react-redux';

import { fetchRefOptions } from 'src/redux/create-branch/actions';

import { SelectBranch } from '../components/select-branch';

const mapDispatchToProps = {
  fetchRefOptions,
};

export default connect(null, mapDispatchToProps)(SelectBranch);
