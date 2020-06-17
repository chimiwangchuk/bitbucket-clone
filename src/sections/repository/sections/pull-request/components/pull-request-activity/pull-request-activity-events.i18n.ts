import { defineMessages } from 'react-intl';

export default defineMessages({
  titleChangeMessage: {
    id: 'frontbucket.repository.pullRequestActivityEvents.titleChangeMessage',
    description:
      'message to display in activity feed when someone has changed the title of the pull request',
    defaultMessage: 'edited the title',
  },
  descriptionChangeMessage: {
    id:
      'frontbucket.repository.pullRequestActivityEvents.descriptionChangeMessage',
    description:
      'message to display in activity feed when someone has changed the description of the pull request',
    defaultMessage: 'edited the description',
  },
  reviewersAddedMessage: {
    id: 'frontbucket.repository.pullRequestActivityEvents.reviewersAdded',
    description:
      'phrasing to show in the activity feed when reviewers are added to a pull request',
    defaultMessage: `added {numReviewers, plural,
      one {{reviewer} as a reviewer}
      =2 {{reviewer} and {reviewer2} as reviewers}
      other {{reviewer} and {otherReviewers} others as reviewers}}`,
  },
  commitEventMessage: {
    id: 'frontbucket.repository.pullRequestActivityEvents.commit',
    description:
      'message to display in activity feed when someone has added commits',
    defaultMessage:
      '{numOfCommits, plural, one {the pull request with {numOfCommits} commit} other {the pull request with {numOfCommits} commits}}',
  },
  commentEventMessage: {
    id:
      'frontbucket.repository.pullRequest.pullRequestActivityEvents.commentEventMessage',
    description:
      'message to display in activity feed component when a user comments in the pull request',
    defaultMessage: 'commented on',
  },
  taskCreatedEventMessage: {
    id:
      'frontbucket.repository.pullRequest.pullRequestActivityEvents.taskCreatedEventMessage',
    description:
      'message to display in activity feed component when a task was created',
    defaultMessage: 'created a',
  },
  taskResolvedEventMessage: {
    id:
      'frontbucket.repository.pullRequest.pullRequestActivityEvents.taskResolvedEventdMessage',
    description:
      'message to display in activity feed component when a task was resolved',
    defaultMessage: 'resolved a',
  },
  taskEventMessage: {
    id:
      'frontbucket.repository.pullRequest.pullRequestActivityEvents.taskEventMessage',
    description:
      'message to display in activity feed component when a task was created/resolved',
    defaultMessage: 'task',
  },
  appovedEventLozenge: {
    id:
      'frontbucket.repository.pullRequest.pullRequestActivityEvents.approvedEventLozenge',
    description:
      'lozenge label in activity feed component when a user approves the pull request',
    defaultMessage: 'APPROVED',
  },
  declinedEventLozenge: {
    id:
      'frontbucket.repository.pullRequest.pullRequestActivityEvents.declinedEventLozenge',
    description:
      'lozenge label in activity feed component when a user declines the pull request',
    defaultMessage: 'DECLINED',
  },
  updatedEventLozenge: {
    id:
      'frontbucket.repository.pullRequest.pullRequestActivityEvents.updatedEventLozenge',
    description:
      'lozenge label in activity feed component when a user updates the pull request',
    defaultMessage: 'UPDATED',
  },
  openedEventLozenge: {
    id:
      'frontbucket.repository.pullRequest.pullRequestActivityEvents.openedEventLozenge',
    description:
      'lozenge label in activity feed component when a user opens the pull request',
    defaultMessage: 'OPENED',
  },
  mergedEventLozenge: {
    id:
      'frontbucket.repository.pullRequest.pullRequestActivityEvents.mergedEventLozenge',
    description:
      'lozenge label in activity feed component when a user merges the pull request',
    defaultMessage: 'MERGED',
  },
  pullRequestContextMessage: {
    id:
      'frontbucket.repository.pullRequest.pullRequestActivityEvents.globalCommentContextMessage',
    description:
      'message to display in activity feed comment event when the comment has a global context',
    defaultMessage: 'the pull request',
  },
  fileRemoved: {
    id: 'frontbucket.repository.pullRequest.pullRequestActivity.fileRemoved',
    description: 'Label that is displayed when file was removed from PR',
    defaultMessage: 'file removed',
  },
  fileNotRendered: {
    id:
      'frontbucket.repository.pullRequest.pullRequestActivity.fileNotRendered',
    defaultMessage: 'file not shown',
    description:
      'Label that is displayed when a file is not rendered in the PR due to limits on PR size',
  },
  outdatedComment: {
    id:
      'frontbucket.repository.pullRequest.pullRequestActivity.outdatedComment',
    description: 'Label that is displayed when comment is outdated',
    defaultMessage: 'outdated',
  },
  repliesConjunction: {
    id: 'frontbucket.pullRequestActivity.repliesConjunction',
    description: 'Phrasing to explain how many people replied',
    defaultMessage:
      '{authors, plural, one {and {authors} other} other {and {authors} others}}',
  },
  repliesMessage: {
    id: 'frontbucket.pullRequestActivity.repliesMessage',
    description:
      'Label that is displayed to indicate people replied to a comment',
    defaultMessage: 'replied on',
  },
});
