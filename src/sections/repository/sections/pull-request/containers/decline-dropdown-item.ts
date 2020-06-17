import { connect } from 'react-redux';
import { DropdownItem } from '@atlaskit/dropdown-menu';
import { BucketDispatch } from 'src/types/state';
import { openDialog } from 'src/redux/pull-request/decline-reducer';

const mapDispatchToProps = (dispatch: BucketDispatch) => ({
  onClick: () => dispatch(openDialog()),
});

export default connect(null, mapDispatchToProps)(DropdownItem);
