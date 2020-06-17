import { connect } from 'react-redux';
import {
  getName,
  getAvatarUrl,
  getProfileUrl,
} from '@atlassian/bitbucket-user-profile';
import { BucketState } from 'src/types/state';

import {
  getCurrentPullRequest,
  getCurrentPullRequestUrlPieces,
  getPullRequestSourceHash,
  getPullRequestDestinationHash,
} from 'src/redux/pull-request/selectors';
import { getCurrentUser } from 'src/selectors/user-selectors';

import {
  ADD_COMMENT,
  DELETE_COMMENT,
  onPermalinkHashChange,
} from 'src/redux/pull-request/actions';
import updateMobileHeaderState from 'src/redux/global/actions/update-mobile-header-state';
import { getFabricConversations } from 'src/selectors/conversation-selectors';
import { getIsFx3Enabled } from 'src/selectors/feature-selectors';
import PullRequestDetails from '../components/pull-request-details';

const mapStateToProps = (state: BucketState) => {
  const { owner, slug, id: pullRequestId } = getCurrentPullRequestUrlPieces(
    state
  );
  const currentPullRequest = getCurrentPullRequest(state);
  const currentUser = getCurrentUser(state);

  return {
    isCommentSpecEnabled: !!state.global.features[
      'new-code-review-comment-specs'
    ],
    areProfileCardsEnabled: !!state.global.features['user-profile-cards'],
    // Destructure user pieces to avoid re-render thrash of denormalized object
    userUuid: currentUser ? currentUser.uuid : undefined,
    userDisplayName: getName(currentUser),
    userAvatarUrl: getAvatarUrl(currentUser),
    userProfileUrl: getProfileUrl(currentUser),
    prDescription: currentPullRequest
      ? currentPullRequest.rendered.description.html
      : '',
    owner,
    slug,
    pullRequestId,
    fabricConversations: getFabricConversations(state),
    destHash: getPullRequestDestinationHash(state),
    anchorHash: getPullRequestSourceHash(state),
    isFx3Enabled: getIsFx3Enabled(state),
  };
};

// @ts-ignore TODO: fix noImplicitAny error here
const addComment = payload => ({
  type: ADD_COMMENT.SUCCESS,
  payload,
});

// @ts-ignore TODO: fix noImplicitAny error here
const deleteComment = payload => ({
  type: DELETE_COMMENT.SUCCESS,
  payload,
});

const mapDispatchToProps = {
  onAddComment: addComment,
  onDeleteComment: deleteComment,
  onPermalinkHashChange,
  updateMobileHeaderState,
};

export default connect(mapStateToProps, mapDispatchToProps)(PullRequestDetails);
