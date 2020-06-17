import { connect } from 'react-redux';
import { BucketState } from 'src/types/state';
import { getValidConversationsForFile } from 'src/selectors/conversation-selectors';
import DiffPlaceholder from '../components/diff-placeholder';

// @ts-ignore TODO: fix noImplicitAny error here
const mapStateToProps = (state: BucketState, ownProps) => ({
  conversations: getValidConversationsForFile(state, ownProps),
});

export default connect(mapStateToProps, null)(DiffPlaceholder);
