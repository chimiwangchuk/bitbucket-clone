import { createSelector } from 'reselect';
import { getFabricConversations } from 'src/selectors/conversation-selectors';
import {
  isNotCommentActivity,
  ActivityApi,
  isTaskActivity,
  isUpdateActivity,
} from 'src/components/activity/types';
import {
  breakoutCommentEntries,
  transformActivities,
  collapseCommits,
} from '../utils/activity-utils';
import { getPullRequestSlice } from './index';

export const getPullRequestActivitySlice = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.activity
);

export const getCurrentPullRequestActivityNextUrl = createSelector(
  getPullRequestActivitySlice,
  activity => activity.nextUrl
);

export const getCurrentPullRequestActivityError = createSelector(
  getPullRequestActivitySlice,
  activity => activity.hasError
);

export const getCurrentPullRequestActivityLoadingState = createSelector(
  getPullRequestActivitySlice,
  activity => activity.isActivityLoading
);

export const getCurrentPullRequestActivityHasNext = createSelector(
  getPullRequestActivitySlice,
  activity => !!activity.nextUrl
);

export const getPullRequestActivityFeed = createSelector(
  getPullRequestActivitySlice,
  getFabricConversations,
  getCurrentPullRequestActivityHasNext,
  /**
   * This is the transformation of activity API events and conversations (data) into
   * Activity Feed Entries (visual representations).
   */
  (activitySlice, fabricConversations, hasNext) => {
    // Event - a single happening as reported by the backend in endpoint data structures
    // Entry - a single visual representation in the Activity Feed of the UI
    const { activityEvents } = activitySlice;

    // We have all comments already so we ignore the ones in Activity Endpoint
    const nonCommentEvents: Array<
      | ActivityApi['Approval']
      | ActivityApi['Update']
      | ActivityApi['TaskActivity']
    > = activityEvents.filter(isNotCommentActivity);

    const getTime = (
      activityEvent:
        | ActivityApi['Approval']
        | ActivityApi['Update']
        | ActivityApi['TaskActivity']
    ): string => {
      if (isUpdateActivity(activityEvent)) {
        return activityEvent.update.date;
      } else if (isTaskActivity(activityEvent)) {
        return activityEvent.task.action_on;
      }
      return activityEvent.approval.date;
    };

    const chronologicalEvents = nonCommentEvents.sort((a, b) => {
      const aTime = getTime(a);
      const bTime = getTime(b);
      return new Date(aTime).getTime() - new Date(bTime).getTime();
    });

    // Build the two classes of entries, activities + comments
    const activityEntries = transformActivities(chronologicalEvents, !hasNext);
    const commentEntries = breakoutCommentEntries(fabricConversations);
    // Combine them
    const combinedEntries = [...activityEntries, ...commentEntries];
    // Put them in oldestToNewest order for commits collapsing, so
    // duplicate commits are only rendered at their oldest point, not most recent.
    const oldestToNewest = combinedEntries.sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );
    // Collapse commit updates into single entries
    const condensedEntries = collapseCommits(oldestToNewest);
    // Reverse so that the feed renders newestToOldest
    return condensedEntries.reverse();
  }
);
