import { all, takeEvery, takeLatest } from 'redux-saga/effects';
import { MergeCheckKey } from 'src/types';
import {
  EXPAND_CONTEXT,
  SCROLL_TO_FILE,
  PUBLISH_BASE_PULL_REQUEST_FACT,
  PUBLISH_PULL_REQUEST_DIFF_FACT,
  ENTERED_CODE_REVIEW,
  FETCH_DIFF,
  FETCH_MERGE_CHECKS_RETRY,
  ADD_COMMENT,
  APPROVE,
  UNAPPROVE,
  EXITED_CODE_REVIEW,
  REFRESH_CODE_REVIEW_DATA,
  REFRESH_CODE_REVIEW_DATA_FROM_POLL_RESULTS,
  LOAD_PULL_REQUEST,
  INITIAL_DIFFS_RENDERED,
  TOGGLE_DIFF_EXPANSION,
  CLOSE_CODE_REVIEW_WELCOME_DIALOG,
  TASK_STATE_CHANGE,
  TASK_CREATE,
  TASK_DELETE,
  RETRY_LOAD_DIFF_STAT,
  REVERT_PULL_REQUEST,
  TASK_EDIT,
  TOGGLE_COMMENT_LIKE,
  TOGGLE_SINGLE_FILE_MODE,
  PULL_REQUEST_OPENED,
  PUBLISH_PULL_REQUEST_UI_EVENT,
  PUBLISH_PULL_REQUEST_TRACK_EVENT,
} from 'src/redux/pull-request/actions';
import { DISMISS_FLAG } from 'src/redux/flags';
import {
  CREATE_PENDING_MERGE,
  CANCEL_PENDING_MERGE,
  FETCH_PENDING_MERGE_STATUS,
  OPEN_MERGE_DIALOG,
} from 'src/redux/pull-request/merge-reducer';
import { VIEW_ENTIRE_FILE } from 'src/redux/pull-request/view-entire-file-reducer';
import ACTIONS from 'src/redux/pr-commits/actions';
import { rootPrCommitsSaga } from 'src/redux/pr-commits/sagas';
import { initCreateJiraIssueSaga } from 'src/redux/jira/sagas/create-jira-issue-saga';
import { fetchPullRequestJiraIssuesSaga } from 'src/redux/jira/sagas/pull-request-jira-issues-saga';
import * as api from '../api';
import { UPLOAD_IMAGE } from '../image-upload-reducer';
import { FETCH_ACTIVITY } from '../activity-reducer';
import {
  publishScreenEventSaga,
  publishUiEventSaga,
  publishTrackEventSaga,
} from './analytics-sagas';
import mergePullRequestSaga from './merge-pull-request-saga';
import approvePullRequestSaga from './approve-pull-request-saga';
import unapprovePullRequestSaga from './unapprove-pull-request-saga';
import declinePullRequestSaga from './decline-pull-request-saga';
import { fetchPendingMergeStatusSaga } from './fetch-pending-merge-status-saga';
import {
  retryFetchMergeChecks,
  retryFetchConcreteMergeChecks,
} from './fetch-merge-checks-saga';
import { createPendingMergeSaga } from './create-pending-merge-saga';
import { cancelPendingMergeSaga } from './cancel-pending-merge-saga';
import { imageUploaderSaga } from './image-upload-saga';
import { rememberImageUploadCallbacks } from './image-upload-callback-saga';
import taskStateChangeSaga from './task-state-change-saga';
import createTaskSaga from './create-task-saga';
import { editTaskSaga, editTasksSaga } from './edit-task-saga';
import deleteTaskSaga from './delete-task-saga';
import { expandContextSaga } from './expand-context-saga';
import {
  commentPermalinkScrollerSaga,
  scrollToLine,
  scrollToFilepath,
  scrollToGenericPermalink,
  permalinkChangedScrollerSaga,
  permalinkClickedScrollerSaga,
  fileScrollerSaga,
  activeFileCollapsedScrollerSaga,
  commentsDialogScrollerSaga,
} from './scrolling-sagas';
import {
  publishBasePullRequestFactSaga,
  publishPullRequestDiffFactSaga,
} from './facts-sagas';
import { commentsContextSaga } from './comments-context-saga';
import { codeReviewDataSaga } from './code-review-data-saga';
import { viewEntireDiffFileSaga } from './fetch-diff-saga';
import { reprocessDiffSaga } from './reprocess-diff-saga';
import { watchSaga } from './watch-saga';
import diffFilesStatePersistor from './diff-files-state-persistor-saga';
import { fetchActivityFeed } from './fetch-activity-saga';
import { startWatchSaga } from './start-watch-saga';
import { stopWatchSaga } from './stop-watch-saga';
import {
  startingPollingForUpdates,
  dismissUpdateFlag,
  minimalUpdateFromPollResults,
  minimalUpdateSaga,
} from './poll-pullrequest-updates-saga';
import { fetchPullRequestComments } from './fetch-pull-request-comments-saga';
import codeInsightsSaga from './fetch-code-insights-reports-saga';
import { fetchPullRequestAnnotations } from './fetch-pull-request-annotations-saga';
import {
  fetchOutdatedCommentContext,
  fetchCommentContext,
} from './fetch-comment-context-saga';
import fetchSourceBranchDetailsSaga from './fetch-source-branch-details-saga';
import { fetchStackedPullRequestsCountSaga } from './fetch-stacked-pull-requests-count-saga';
import { updateLastSeenSaga } from './update-last-seen-saga';
import { closeWelcomeDialogSaga } from './close-welcome-dialog-saga';
import { fetchDiffStatForCurrentPullRequest } from './fetch-diffstat-saga';
import { revertPullRequestSaga } from './revert-pull-request-saga';
import { viewPullRequestCapabilitySaga } from './measure-sli-saga';
import { fetchCommitsStatusesSaga } from './fetch-commit-statuses';
import { fetchCommentLikes } from './fetch-comment-likes-saga';
import { toggleCommentLike } from './toggle-comment-like-saga';
import {
  singleFileModeEnabledSaga,
  dismissFileModeEnabledFlag,
  saveFileModeFlagEnabledSeenStateSaga,
  SINGLE_FILE_MODE_FLAG_ID,
} from './single-file-mode-saga';

export default function*() {
  yield all([
    rootPrCommitsSaga(),
    mergePullRequestSaga(),
    takeLatest(LOAD_PULL_REQUEST.SUCCESS, fetchPullRequestComments),
    takeLatest(LOAD_PULL_REQUEST.SUCCESS, fetchCommentLikes),
    takeLatest(LOAD_PULL_REQUEST.SUCCESS, fetchSourceBranchDetailsSaga),
    takeLatest(FETCH_PENDING_MERGE_STATUS.REQUEST, fetchPendingMergeStatusSaga),
    takeLatest(CREATE_PENDING_MERGE.REQUEST, createPendingMergeSaga),
    takeLatest(CANCEL_PENDING_MERGE.REQUEST, cancelPendingMergeSaga),
    approvePullRequestSaga(),
    unapprovePullRequestSaga(),
    declinePullRequestSaga(),
    takeEvery(UPLOAD_IMAGE.REQUEST, imageUploaderSaga),
    rememberImageUploadCallbacks(),
    taskStateChangeSaga(),
    createTaskSaga(),
    takeEvery([TASK_EDIT.REQUEST], editTaskSaga),
    takeEvery([TOGGLE_COMMENT_LIKE.REQUEST], toggleCommentLike),
    editTasksSaga(),
    deleteTaskSaga(),
    takeEvery(EXPAND_CONTEXT.REQUEST, expandContextSaga),
    takeLatest(ENTERED_CODE_REVIEW, scrollToGenericPermalink),
    takeLatest(INITIAL_DIFFS_RENDERED, scrollToLine),
    takeLatest(INITIAL_DIFFS_RENDERED, scrollToFilepath),
    commentPermalinkScrollerSaga(),
    permalinkClickedScrollerSaga(),
    permalinkChangedScrollerSaga(),
    commentsDialogScrollerSaga(),
    takeLatest(SCROLL_TO_FILE, fileScrollerSaga),
    takeEvery(PUBLISH_BASE_PULL_REQUEST_FACT, publishBasePullRequestFactSaga),
    takeEvery(PUBLISH_PULL_REQUEST_DIFF_FACT, publishPullRequestDiffFactSaga),
    takeEvery(PULL_REQUEST_OPENED, publishScreenEventSaga),
    takeEvery(PUBLISH_PULL_REQUEST_TRACK_EVENT, publishTrackEventSaga),
    takeEvery(PUBLISH_PULL_REQUEST_UI_EVENT, publishUiEventSaga),
    commentsContextSaga(),
    takeLatest(ENTERED_CODE_REVIEW, viewPullRequestCapabilitySaga),
    takeLatest(ENTERED_CODE_REVIEW, codeReviewDataSaga),
    takeLatest(ENTERED_CODE_REVIEW, startingPollingForUpdates),
    takeLatest(ENTERED_CODE_REVIEW, initCreateJiraIssueSaga),
    takeLatest(ENTERED_CODE_REVIEW, fetchPullRequestJiraIssuesSaga),
    takeLatest(
      // @ts-ignore
      action =>
        action.type === ENTERED_CODE_REVIEW ||
        // single file mode toggled on
        (action.type === TOGGLE_SINGLE_FILE_MODE && action.payload),
      singleFileModeEnabledSaga
    ),
    takeLatest(
      // @ts-ignore
      action =>
        // only save seen state on user-initiated dismissal
        action.type === DISMISS_FLAG &&
        action.payload.id === SINGLE_FILE_MODE_FLAG_ID &&
        (!('updateSeenState' in action.payload) ||
          action.payload.updateSeenState),
      saveFileModeFlagEnabledSeenStateSaga
    ),
    takeLatest(
      // @ts-ignore
      action =>
        action.type === EXITED_CODE_REVIEW ||
        // single file mode toggled off
        (action.type === TOGGLE_SINGLE_FILE_MODE && !action.payload),
      dismissFileModeEnabledFlag
    ),
    takeLatest(EXITED_CODE_REVIEW, dismissUpdateFlag),
    diffFilesStatePersistor(),
    takeLatest(FETCH_MERGE_CHECKS_RETRY, retryFetchMergeChecks),
    takeLatest(
      [TASK_STATE_CHANGE.SUCCESS, TASK_CREATE.SUCCESS, TASK_DELETE.SUCCESS],
      retryFetchConcreteMergeChecks,
      // @ts-ignore TS defs for redux-saga aren't perfect
      [MergeCheckKey.RESOLVED_TASKS]
    ),
    takeLatest(
      [APPROVE.SUCCESS, UNAPPROVE.SUCCESS],
      retryFetchConcreteMergeChecks,
      // @ts-ignore TS defs for redux-saga aren't perfect
      [
        MergeCheckKey.MINIMUM_APPROVALS,
        MergeCheckKey.MINIMUM_DEFAULT_REVIEWER_APPROVALS,
      ]
    ),
    takeLatest(REFRESH_CODE_REVIEW_DATA, minimalUpdateSaga),
    takeLatest(
      REFRESH_CODE_REVIEW_DATA_FROM_POLL_RESULTS,
      minimalUpdateFromPollResults
    ),
    takeLatest(FETCH_ACTIVITY.REQUEST, fetchActivityFeed),
    reprocessDiffSaga(),
    takeLatest(
      [FETCH_DIFF.SUCCESS, ADD_COMMENT.SUCCESS, APPROVE.SUCCESS],
      watchSaga,
      // @ts-ignore TS defs for redux-saga aren't perfect
      api.getWatch
    ),
    takeLatest(
      // @ts-ignore TODO: fix noImplicitAny error here
      action =>
        action.type === TOGGLE_DIFF_EXPANSION &&
        action.payload.isOpening === false,
      activeFileCollapsedScrollerSaga
    ),
    startWatchSaga(),
    stopWatchSaga(),
    fetchOutdatedCommentContext(api.getCommentById),
    fetchCommentContext(api.getCommentById),
    takeLatest(
      [ADD_COMMENT.SUCCESS, LOAD_PULL_REQUEST.SUCCESS],
      updateLastSeenSaga
    ),
    takeLatest(CLOSE_CODE_REVIEW_WELCOME_DIALOG, closeWelcomeDialogSaga),
    takeLatest(OPEN_MERGE_DIALOG, fetchStackedPullRequestsCountSaga),
    takeLatest(RETRY_LOAD_DIFF_STAT, fetchDiffStatForCurrentPullRequest),
    takeLatest(REVERT_PULL_REQUEST.REQUEST, revertPullRequestSaga),
    takeLatest(ACTIONS.UPDATE_COMMITS, fetchCommitsStatusesSaga),
    codeInsightsSaga(),
    takeLatest(LOAD_PULL_REQUEST.SUCCESS, fetchPullRequestAnnotations),
    takeLatest(VIEW_ENTIRE_FILE, viewEntireDiffFileSaga),
  ]);
}
