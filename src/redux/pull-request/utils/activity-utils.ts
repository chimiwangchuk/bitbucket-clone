import { isEmpty } from 'lodash-es';
import { FabricConversation } from 'src/components/conversation-provider/types';
import {
  CommentStartEntry,
  CommentRepliesEntry,
  isUpdateActivity,
  isApprovalActivity,
  isTaskActivity,
  CommitEntry,
  ActivityEntry,
  isCommitEntry,
  ActivityApi,
} from 'src/components/activity/types';
import { toBBUser } from 'src/components/conversation-provider/utils';
import { shortHash } from 'src/utils/short-hash';

/**
 * Conversations always represent at least a STARTER but may also represent a REPLY
 * @param fabricConversations
 */
export const breakoutCommentEntries = (
  fabricConversations: FabricConversation[]
) => {
  const commentEntries: Array<CommentStartEntry | CommentRepliesEntry> = [];

  fabricConversations.forEach(conversation => {
    const isDeleted = conversation.comments[0].deleted;
    if (!isDeleted) {
      commentEntries.push({
        type: 'comment-start',
        event: conversation,
        actor: toBBUser(conversation.comments[0].createdBy),
        timestamp: new Date(conversation.createdAt),
      });
    }

    const notDeletedReplies = conversation.comments
      .slice(1)
      .filter(comment => !comment.deleted);

    const hasReplies = notDeletedReplies.length > 0;
    if (hasReplies) {
      const sortedComments = notDeletedReplies.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      const latestComment = sortedComments[0];

      commentEntries.push({
        type: 'comment-replies',
        event: conversation,
        numOfReplies: notDeletedReplies.length,
        actor: toBBUser(latestComment.createdBy),
        timestamp: new Date(latestComment.createdAt),
      });
    }
  });

  return commentEntries;
};

/** Simple builder for title change activity feed entries */
const titleChanged = (event: ActivityApi['Update']) => ({
  type: 'title-change' as const,
  actor: event.update.author,
  event,
  lastTitle: event.update.changes.title!.old,
  timestamp: new Date(event.update.date),
});

/** Simple builder for description change activity feed entries */
const descriptionChanged = (event: ActivityApi['Update']) => ({
  type: 'description-change' as const,
  actor: event.update.author,
  event,
  timestamp: new Date(event.update.date),
});

/** Simple builder for commit activity feed entries */
export const updated = (event: ActivityApi['Update']): CommitEntry => {
  const { commit } = event.update.source;
  return {
    type: 'update' as const,
    actor: event.update.author,
    event,
    hashes: [
      {
        hash: commit ? shortHash(commit.hash) : null,
        url: commit ? commit.links.html.href : null,
      },
    ],
    timestamp: new Date(event.update.date),
  };
};

/** Simple builder for status change activity feed entries */
const statusChanged = (event: ActivityApi['Update']) => ({
  type: 'status-change' as const,
  actor: event.update.author,
  event,
  timestamp: new Date(event.update.date),
});

/** Simple builder for the reviewers added activity feed entires */
const reviewersAdded = (event: ActivityApi['Update']) => ({
  type: 'reviewers-added' as const,
  actor: event.update.author,
  event,
  timestamp: new Date(event.update.date),
});

/** Simple builder for approval activity feed entries */
const approved = (event: ActivityApi['Approval']) => ({
  type: 'approval' as const,
  event,
  actor: event.approval.user,
  timestamp: new Date(event.approval.date),
});

/** Simple builder for the task created activity feed entries */
const taskCreated = (event: ActivityApi['TaskActivity']) => ({
  type: 'task-created' as const,
  actor: event.task.actor,
  event,
  timestamp: new Date(event.task.action_on),
});

/** Simple builder for the task resolved activity feed entries */
const taskResolved = (event: ActivityApi['TaskActivity']) => ({
  type: 'task-resolved' as const,
  actor: event.task.actor,
  event,
  timestamp: new Date(event.task.action_on),
});

/**
 * This turns Activity Endpoint events into Activity Feed Entries.
 * Updates can become TitleChanges, DescriptionChanges, StatusChanges, or Commits.
 * Approval events become Approval Entries.
 *
 * Behavior changes if we have all events. Represented by the second parameter.
 * When a PR is first created the backend creates two UPDATE activity events that both represent the OPENing of the PR.
 * If we have all events then we know we can turn the original event into a StatusChange->OPEN and drop the second event.
 * The rest of the items can be processed as normal.
 *
 * @param chronologicalEvents Should be in chronological order from oldest to newest
 * @param hasAllEvents Whether or not we have every event, the endpoint can be paginated
 */
export const transformActivities = (
  chronologicalEvents: Array<
    | ActivityApi['Approval']
    | ActivityApi['Update']
    | ActivityApi['TaskActivity']
  >,
  hasAllEvents?: boolean
): ActivityEntry[] => {
  let openEvent: ActivityApi['Update'] | undefined;
  let updateEventsSeen = 0;

  // The first two update events from the API will be duplicate OPEN events
  // Capture the values of 2nd and discard the 1st
  const result: ActivityEntry[] = chronologicalEvents
    .filter(activityEvent => {
      if (
        hasAllEvents &&
        updateEventsSeen < 2 &&
        isUpdateActivity(activityEvent)
      ) {
        openEvent = activityEvent;
        updateEventsSeen += 1;
        return false;
      }
      return true;
    })
    .reduce((events, event) => {
      if (isUpdateActivity(event)) {
        const changes = event.update.changes ? event.update.changes : {};
        if (isEmpty(changes)) {
          events.push(updated(event));
        } else {
          if ('title' in changes) {
            events.push(titleChanged(event));
          }
          if ('description' in changes) {
            events.push(descriptionChanged(event));
          }
          if ('status' in changes) {
            events.push(statusChanged(event));
          }
          if ('reviewers' in changes && 'added' in changes.reviewers!) {
            events.push(reviewersAdded(event));
          }
        }
      } else if (isApprovalActivity(event)) {
        events.push(approved(event));
      } else if (isTaskActivity(event)) {
        if (event.task.action === 'CREATED') {
          events.push(taskCreated(event));
        } else if (event.task.action === 'RESOLVED') {
          events.push(taskResolved(event));
        }
      }
      return events;
    }, [] as ActivityEntry[]);

  if (openEvent && isUpdateActivity(openEvent)) {
    // These are supposed to be sorted oldest -> newest so we put the OPEN in front
    result.unshift(statusChanged(openEvent));
  }

  return result;
};

/**
 * Accepts a list of Activity Feed Entries and condenses contiguous sequences of
 * commits performed by the same author into single Entries with hashes of each commit they made.
 * Any activity in between the commits disqualifies the commits from being condensed. This mimics
 * the behavior of the old pull request activity tab.
 *
 * A consequence of the sort direction is that UPDATEs with the same commit hash will only show the
 * first one encountered in the list. So if sorted old-to-new then the commit entry will appear in
 * the oldest place it first occurred, and vice versa.
 *
 * @param entries Activity Feed Entries, sorted chronologically in either direction
 */
export const collapseCommits = (entries: ActivityEntry[]) => {
  return entries.reduce((previousEntries, currentEntry) => {
    if (!isCommitEntry(currentEntry)) {
      // We aren't concerned with non-commits here
      return [...previousEntries, currentEntry];
    }

    const { commit } = currentEntry.event.update.source;

    const newHash = commit ? shortHash(commit.hash) : null;
    const isContainedInAnyPreviousCommitEntry =
      newHash &&
      previousEntries.filter(
        entry =>
          isCommitEntry(entry) &&
          entry.hashes.find(({ hash }) => hash === shortHash(newHash))
      ).length > 0;

    if (isContainedInAnyPreviousCommitEntry) {
      // If the commit hash has already been added to any commit entry then
      // this return ensures that we don't add it as a new event either.
      return previousEntries;
    }

    const previousEntry = previousEntries[previousEntries.length - 1];
    if (isCommitEntry(previousEntry)) {
      const isSameAuthor = currentEntry.actor.uuid === previousEntry.actor.uuid;

      if (isSameAuthor) {
        previousEntry.hashes.push({
          hash: commit ? shortHash(commit.hash) : null,
          url: commit ? commit.links.html.href : null,
        });
        return previousEntries;
      }
    }

    // This return is the result of it being a brand new commit entry
    return [...previousEntries, currentEntry];
  }, [] as ActivityEntry[]);
};
