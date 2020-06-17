import { connect } from 'react-redux';
import GlobalConversation from 'src/components/global-conversation';
import { onPermalinkHashChange } from 'src/redux/pull-request/actions';
import { BucketState } from 'src/types/state';
import {
  getContainerId,
  getCanLikeComments,
  getCommentLikes,
} from 'src/redux/pull-request/selectors';
import { getConversationsGlobal } from 'src/selectors/conversation-selectors';
import { getRepositoryAccessLevel } from 'src/selectors/repository-selectors';
import { getCanCreateTask } from 'src/selectors/task-selectors';
import { getCurrentUserKey } from 'src/selectors/user-selectors';

const mapStateToProps = (state: BucketState) => {
  const [conversation] = getConversationsGlobal(state);
  const containerId = getContainerId(state);
  const userAccessLevel = getRepositoryAccessLevel(state);

  const { comments } = { ...conversation };

  return {
    conversation,
    containerId,
    userAccessLevel,
    isLoading: false,
    canCreateTask: getCanCreateTask(state),
    canLikeComments: getCanLikeComments(state),
    currentUserKey: getCurrentUserKey(state),
    commentLikes: getCommentLikes(state, comments),
  };
};

const mapDispatchToProps = {
  onPermalinkHashChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(GlobalConversation);
