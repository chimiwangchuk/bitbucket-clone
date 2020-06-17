import { PullRequest } from 'src/components/types';

const REVIEWER_ROLE = 'REVIEWER';

export default (
  pullRequest: PullRequest,
  currentUserUuid?: string | undefined
) => {
  const { author, participants } = pullRequest;

  const isNotAuthor = (participant: BB.PullRequestParticipant) =>
    !author || !participant.user || participant.user.uuid !== author.uuid;
  const isReviewer = (participant: BB.PullRequestParticipant) =>
    participant.role === REVIEWER_ROLE || participant.approved;

  const reviewers = participants.filter(
    participant => isReviewer(participant) && isNotAuthor(participant)
  );
  const approvers = reviewers.filter(reviewer => reviewer.approved);
  const others = reviewers.filter(reviewer => !reviewer.approved);

  if (currentUserUuid) {
    const isCurrentUser = (participant: BB.PullRequestParticipant) =>
      participant.user && participant.user.uuid === currentUserUuid;

    const sortCurrentUserFirst = (arr: BB.PullRequestParticipant[]) => {
      arr.sort((a, b) => {
        if (isCurrentUser(a)) {
          return -1;
        }
        if (isCurrentUser(b)) {
          return 1;
        }
        return 0;
      });
    };

    sortCurrentUserFirst(approvers);
    sortCurrentUserFirst(others);
  }
  return [...approvers, ...others];
};
