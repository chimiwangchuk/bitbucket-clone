import { connect } from 'react-redux';
import { BucketState } from 'src/types/state';
import { getCurrentPullRequestParticipants } from 'src/redux/pull-request/selectors';
import { getCurrentUser } from 'src/selectors/user-selectors';

import ApprovalButton from 'src/components/approval-button';

import { APPROVE, UNAPPROVE } from 'src/redux/pull-request/actions';

const mapStateToProps = (state: BucketState) => {
  const { isLoading, isError, isDisabled } = state.repository.pullRequest;
  const currentUser = getCurrentUser(state);
  const uuid = currentUser ? currentUser.uuid : null;
  const foundParticipant = getCurrentPullRequestParticipants(state).find(
    participant => !!participant.user && participant.user.uuid === uuid
  );

  const hasApproved = foundParticipant && foundParticipant.approved;

  return {
    hasApproved,
    isError,
    isLoading,
    isDisabled,
  };
};

const approveIt = () => ({ type: APPROVE.REQUEST });
const unapproveIt = () => ({ type: UNAPPROVE.REQUEST });

const mapDispatchToProps = {
  approve: approveIt,
  unapprove: unapproveIt,
};

export default connect(mapStateToProps, mapDispatchToProps)(ApprovalButton);
