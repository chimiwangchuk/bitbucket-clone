import { connect } from 'react-redux';
import { BucketState } from 'src/types/state';
import {
  requestDecline,
  closeDialog,
  getIsDeclineRequesting,
  getIsDeclineErrored,
  getDeclineErrorMessage,
} from 'src/redux/pull-request/decline-reducer';
import DeclineDialog from '../components/decline-dialog/decline-dialog';

const mapStateToProps = (state: BucketState) => ({
  isRequesting: getIsDeclineRequesting(state),
  isErrored: getIsDeclineErrored(state),
  errorMessage: getDeclineErrorMessage(state),
});

const mapDispatchToProps = {
  declinePullRequest: requestDecline,
  onClose: closeDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeclineDialog);
