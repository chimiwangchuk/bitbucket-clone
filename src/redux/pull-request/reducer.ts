import { LineAnnotation } from '@atlassian/bitkit-diff/types';
import { BuildStatus } from 'src/components/types';
import createReducer from 'src/utils/create-reducer';
import { Conflict, MergeCheck } from 'src/types';
import { Diff } from 'src/types/pull-request';
import {
  ApiComment,
  CodeReviewConversation,
  isFileComment,
} from 'src/components/conversation-provider/types';
import { reconcileChunks } from 'src/redux/pull-request/utils/reconcile-chunks';
import { UPDATE_GLOBAL_DIFF_VIEW_MODE_SUCCESS } from 'src/redux/pull-request-settings';
import { extractFilepath } from 'src/utils/extract-file-path';
import { FetchSourceRepositoryDetails } from 'src/sections/repository/actions';
import {
  SourceRepositoryDetailsState,
  initialStateSourceRepository,
} from 'src/sections/repository/reducers/details';
import { DetailedBranch } from 'src/sections/repository/sections/branches/types';
import {
  LINE_PERMALINK_MATCHER,
  getFilepathAnchorId,
} from 'src/utils/permalink-helpers';
import { DiffStat } from 'src/types/diffstat';
import { NETWORK_ONLINE, LoadGlobal } from 'src/redux/global/actions';
import { CodeInsightsResult } from 'src/types/code-insights';
import { BranchSyncInfo } from './types';
import { ActivityState, activityInitialState } from './activity-reducer';
import { declineInitialState } from './decline-reducer';
import { mergeInitialState, MergeState } from './merge-reducer';
import { imageUploadInitialState } from './image-upload-reducer';
import { mergeContextLinesWithChunks } from './utils/merge-context-lines-with-chunks';
import * as Actions from './actions';
import { DiffStateMap } from './actions/diffs-expansion';
import {
  PullRequestPollingState,
  initialState as pollingInitialState,
} from './polling-reducer';
import {
  PullRequestTasksState,
  initialState as tasksInitialState,
} from './tasks-reducer';
import { viewEntireFileInitialState } from './view-entire-file-reducer';

export type PullRequestState = {
  activeDiff: string;
  activity: ActivityState;
  activePermalink: string;
  annotations?: LineAnnotation[];
  builds: BuildStatus[];
  diffsExpansionState: DiffStateMap;
  diffCommentingMap: DiffStateMap;
  sideBySideDiffState: DiffStateMap;
  isMergeable: boolean;
  contextLines: { [key: string]: string | undefined };
  conflicts: Conflict[];
  currentPullRequest: string | null | undefined;
  decline: typeof declineInitialState;
  defaultMergeStrategy: string | null | undefined;
  diff: Diff[];
  diffStat: DiffStat[] | undefined;
  error: boolean;
  getError?: string;
  imageUpload: typeof imageUploadInitialState;
  isDiffsLoading: boolean;
  isDisabled: boolean;
  isError: boolean;
  isErrorDialogOpen: boolean;
  isLoading: boolean;
  isMergeChecksLoading: boolean;
  isOutdatedDialogOpen: boolean;
  isDiffCommentsDialogOpen: boolean;
  isSingleFileMode: boolean;
  isSingleFileModeEligible: boolean;
  isSingleFileModeSettingsHeaderVisible: boolean;
  isStickyHeaderActive: boolean;
  isNonRenderedDiffCommentsDialogOpen: boolean;
  isWatching: boolean;
  lastPullRequestRetrieved: number | null;
  merge: MergeState;
  mergeChecks: MergeCheck[];
  mergeChecksError: string;
  outdatedCommentsDialog: string | undefined;
  diffCommentsDialog?: string;
  nonRenderedDiffCommentsDialogFilepath?: string;
  polling: PullRequestPollingState;
  rawComments: ApiComment[];
  tasks: PullRequestTasksState;
  uses_comment_service: boolean;
  watchActionLoading: boolean;
  isWelcomeDialogOpen: boolean;
  errorCode?: number | string | null;
  diffStatError: string;
  isEditorOpen: boolean;
  branchSyncInfo: BranchSyncInfo | null;
  isWelcomeTourActive: boolean;
  isRevertDialogOpen: boolean;
  revertError: string | null;
  isPipelinesEnabled: boolean;
  isPipelinesPremium: boolean;
  codeInsightsReports?: CodeInsightsResult[];
  isCodeInsightsReportsLoading?: boolean;
  hasCodeInsightsReportsError?: boolean;
  codeInsightsAnnotations?: { [key: string]: LineAnnotation[] };
  isCodeInsightsAnnotationsLoading?: boolean;
  hasDestinationBranch: boolean;
  sourceRepository: SourceRepositoryDetailsState;
  sourceBranchDetails: DetailedBranch | undefined;
  canCurrentUserMerge: boolean;
  viewEntireFile: typeof viewEntireFileInitialState;
};

export const initialState: PullRequestState = {
  activeDiff: '',
  activity: activityInitialState,
  activePermalink: '',
  annotations: undefined,
  builds: [],
  contextLines: {},
  diffsExpansionState: {},
  sideBySideDiffState: {},
  isMergeable: false,
  conflicts: [],
  currentPullRequest: null,
  decline: declineInitialState,
  defaultMergeStrategy: null,
  diff: [],
  diffCommentingMap: {},
  diffStat: undefined,
  error: false,
  getError: '',
  imageUpload: imageUploadInitialState,
  isDiffsLoading: false,
  isDisabled: false,
  isError: false,
  isErrorDialogOpen: false,
  isLoading: false,
  isMergeChecksLoading: false,
  isOutdatedDialogOpen: false,
  isDiffCommentsDialogOpen: false,
  isSingleFileMode: false,
  isSingleFileModeEligible: false,
  isSingleFileModeSettingsHeaderVisible: true,
  isStickyHeaderActive: false,
  isNonRenderedDiffCommentsDialogOpen: false,
  isPipelinesEnabled: false,
  isPipelinesPremium: false,
  isWatching: false,
  lastPullRequestRetrieved: null,
  merge: mergeInitialState,
  mergeChecks: [],
  mergeChecksError: '',
  outdatedCommentsDialog: undefined,
  polling: pollingInitialState,
  rawComments: [],
  tasks: tasksInitialState,
  uses_comment_service: false,
  watchActionLoading: true,
  isWelcomeDialogOpen: true,
  errorCode: null,
  diffStatError: '',
  isEditorOpen: false,
  branchSyncInfo: null,
  isWelcomeTourActive: false,
  isRevertDialogOpen: false,
  revertError: null,
  hasDestinationBranch: true,
  sourceRepository: initialStateSourceRepository,
  sourceBranchDetails: undefined,
  canCurrentUserMerge: true,
  viewEntireFile: viewEntireFileInitialState,
};

function mergeContextLines(
  state: PullRequestState,
  action: {
    type: string;
    payload: CodeReviewConversation[];
  }
) {
  const { payload: convos } = action;

  const newContextLines = { ...state.contextLines };
  // We map each context lines value to its convo id, overriding any old values
  convos.forEach(convo => {
    newContextLines[convo.conversationId] = convo.meta.context_lines;
  });

  return {
    ...state,
    contextLines: newContextLines,
  };
}

// If single file mode is in use, this returns the first file from the diffstat
// so that the activeFile (highlighted file tree item) can be set.
function activeDiffSetToFirstFile(
  oldState: PullRequestState,
  isSingleFileMode: boolean,
  diffStatValues?: DiffStat[]
): string {
  const oldActiveDiff = oldState.activeDiff;
  const diffStats = diffStatValues || oldState.diffStat;
  if (!isSingleFileMode || !diffStats?.length) {
    return oldActiveDiff;
  } else if (!oldActiveDiff) {
    return getFilepathAnchorId(extractFilepath(diffStats[0]));
  }

  // If there is an active diff, returns the previous "active item" if it exists in the
  // new diffStat.
  const isOldAnchorInNewDiffStats = diffStats.some(
    diffStat => getFilepathAnchorId(extractFilepath(diffStat)) === oldActiveDiff
  );
  return isOldAnchorInNewDiffStats
    ? oldActiveDiff
    : getFilepathAnchorId(extractFilepath(diffStats[0]));
}

export default createReducer(initialState, {
  [Actions.FETCH_CONFLICTS.SUCCESS](state, action) {
    return {
      ...state,
      conflicts: action.payload,
    };
  },
  [Actions.FETCH_MERGE_CHECKS.REQUEST](state) {
    return {
      ...state,
      isMergeChecksLoading: true,
      isMergeable: false,
    };
  },
  [Actions.FETCH_MERGE_CHECKS.SUCCESS](state, action) {
    const { mergeChecks, isMergeable, canCurrentUserMerge } = action.payload;

    return {
      ...state,
      isMergeChecksLoading: false,
      mergeChecks,
      isMergeable,
      canCurrentUserMerge,
    };
  },
  [Actions.FETCH_MERGE_CHECKS.ERROR](state, action) {
    return {
      ...state,
      mergeChecksError: action.payload,
      isMergeChecksLoading: false,
    };
  },
  [Actions.FETCH_MERGE_CHECKS_RETRY](state) {
    return {
      ...state,
      isMergeChecksLoading: true,
    };
  },
  [Actions.LOAD_PULL_REQUEST.SUCCESS](state, action) {
    const { result } = action.payload;
    return {
      ...state,
      ...result,
      lastPullRequestRetrieved: Date.now(),
    };
  },
  [Actions.UNLOAD_PULL_REQUEST](state) {
    const {
      contextLines,
      currentPullRequest,
      diff,
      diffStat,
      rawComments,
    } = initialState;

    return {
      ...state,
      contextLines,
      diff,
      diffStat,
      currentPullRequest,
      rawComments,
    };
  },
  [Actions.UPDATE_PARTICIPANTS.SUCCESS](state, action) {
    return {
      ...state,
      currentPullRequest: action.payload.result.currentPullRequest,
    };
  },
  [Actions.FETCH_DIFF.REQUEST](state) {
    return {
      ...state,
      isDiffsLoading: true,
    };
  },
  [Actions.FETCH_DIFF.SUCCESS](state, action) {
    const { payload: diff } = action;
    return {
      ...state,
      diff,
      isDiffsLoading: false,
    };
  },
  [Actions.FETCH_DIFF.ERROR](state, action) {
    const { payload: errorCode } = action;

    return {
      ...state,
      isDiffsLoading: false,
      errorCode,
    };
  },
  [Actions.FETCH_PULL_REQUEST_ANNOTATIONS.SUCCESS](state, action) {
    const { payload: annotations } = action;
    return {
      ...state,
      annotations,
    };
  },
  [Actions.FETCH_IS_PIPELINES_ENABLED.REQUEST](state) {
    return {
      ...state,
      isPipelinesEnabled: false,
      isPipelinesPremium: false,
    };
  },
  [Actions.FETCH_IS_PIPELINES_ENABLED.SUCCESS](state, action) {
    return {
      ...state,
      isPipelinesEnabled: action.payload.isPipelinesEnabled,
      isPipelinesPremium: action.payload.isPipelinesPremium,
    };
  },
  [Actions.FETCH_CODE_INSIGHTS_REPORTS.REQUEST](state) {
    return {
      ...state,
      isCodeInsightsReportsLoading: true,
    };
  },
  [Actions.FETCH_CODE_INSIGHTS_REPORTS.ERROR](state) {
    return {
      ...state,
      isCodeInsightsReportsLoading: false,
      hasCodeInsightsReportsError: true,
    };
  },
  [Actions.FETCH_CODE_INSIGHTS_REPORTS.SUCCESS](state, action) {
    const { payload: codeInsightsReports } = action;
    return {
      ...state,
      isCodeInsightsReportsLoading: false,
      codeInsightsReports,
    };
  },
  [Actions.FETCH_CODE_INSIGHTS_ANNOTATIONS.REQUEST](state) {
    return {
      ...state,
      isCodeInsightsAnnotationsLoading: true,
    };
  },
  [Actions.FETCH_CODE_INSIGHTS_ANNOTATIONS.ERROR](state) {
    return {
      ...state,
      isCodeInsightsAnnotationsLoading: false,
    };
  },
  [Actions.FETCH_CODE_INSIGHTS_ANNOTATIONS.SUCCESS](state, action) {
    return {
      ...state,
      isCodeInsightsAnnotationsLoading: false,
      codeInsightsAnnotations: {
        ...(state.codeInsightsAnnotations || {}),
        ...(action.meta && action.meta.reportId
          ? { [action.meta.reportId]: action.payload }
          : {}),
      },
    };
  },
  [Actions.FETCH_COMMENT_CONTEXT.SUCCESS](state, action) {
    const { newChunk, path } = action.payload;
    const { diff } = state;

    const targetDiff = diff.find(
      currentDiff =>
        currentDiff.to === path ||
        (currentDiff.to === null && currentDiff.from === path)
    );

    if (!targetDiff) {
      return state;
    }

    const updatedDiff = {
      ...targetDiff,
      chunks: reconcileChunks([newChunk, ...targetDiff.chunks]),
    };

    return {
      ...state,
      diff: [
        ...diff.slice(0, diff.indexOf(targetDiff)),
        updatedDiff,
        ...diff.slice(diff.indexOf(targetDiff) + 1),
      ],
    };
  },
  [Actions.EXPAND_CONTEXT.SUCCESS](state, action) {
    const {
      fileIndex,
      chunkId,
      beforeOrAfter,
      contextLines,
      hasMoreLines,
    } = action.payload;
    const { diff } = state;
    const newDiff = [...diff];
    const newFile = { ...diff[fileIndex] };

    newFile.chunks = mergeContextLinesWithChunks(
      diff[fileIndex].chunks,
      chunkId,
      contextLines,
      beforeOrAfter,
      hasMoreLines
    );

    newDiff[fileIndex] = newFile;

    return {
      ...state,
      diff: newDiff,
    };
  },
  [Actions.APPROVE.REQUEST](state) {
    return {
      ...state,
      isDisabled: true,
    };
  },
  [Actions.APPROVE.SUCCESS](state) {
    return {
      ...state,
      isDisabled: false,
      isError: false,
      getError: '',
      isLoading: false,
    };
  },
  [Actions.APPROVE.ERROR](state, action) {
    return {
      ...state,
      isError: true,
      getError: action.payload,
      isErrorDialogOpen: true,
      isLoading: false,
      isDisabled: false,
    };
  },
  [Actions.UNAPPROVE.REQUEST](state) {
    return {
      ...state,
      isDisabled: true,
    };
  },
  [Actions.UNAPPROVE.SUCCESS](state) {
    return {
      ...state,
      isDisabled: false,
      isError: false,
      getError: '',
      isLoading: false,
    };
  },
  [Actions.UNAPPROVE.ERROR](state, action) {
    return {
      ...state,
      isError: true,
      getError: action.payload,
      isErrorDialogOpen: true,
      isLoading: false,
      isDisabled: false,
    };
  },
  [Actions.HIDE_ERROR_DIALOG](state) {
    return {
      ...state,
      isErrorDialogOpen: false,
    };
  },
  [NETWORK_ONLINE](state) {
    return {
      ...state,
      isErrorDialogOpen: false,
    };
  },
  [Actions.SET_APPROVAL_LOADER](state) {
    return {
      ...state,
      isLoading: true,
    };
  },
  [Actions.FETCH_COMMENTS.REQUEST](state) {
    return {
      ...state,
      rawComments: [],
    };
  },
  [Actions.FETCH_COMMENTS.SUCCESS](state, action) {
    const { rawComments } = action.payload;

    return {
      ...state,
      rawComments,
    };
  },
  [Actions.ADD_COMMENT.SUCCESS](state, action) {
    const comment: ApiComment = action.payload;

    const nextDiffCommentingMap = isFileComment(comment)
      ? {
          ...state.diffCommentingMap,
          [comment.inline.path]: false,
        }
      : state.diffCommentingMap;

    return {
      ...state,
      rawComments: [...state.rawComments, comment],
      diffCommentingMap: nextDiffCommentingMap,
    };
  },
  [Actions.DELETE_COMMENT.SUCCESS](state, action) {
    const foundComment = state.rawComments.find(
      comment => comment.id === action.payload.id
    );

    if (!foundComment) {
      return state;
    }

    const index = state.rawComments.indexOf(foundComment);
    const newComment = {
      ...foundComment,
      deleted: true,
    };

    const commentsBefore = state.rawComments.slice(0, index);
    const commentsAfter = state.rawComments.slice(index + 1);

    return {
      ...state,
      rawComments: [...commentsBefore, newComment, ...commentsAfter],
    };
  },
  [Actions.FETCH_OUTDATED_COMMENT_CONTEXT.SUCCESS]: mergeContextLines,
  [Actions.FETCH_LARGE_FILE_COMMENT_CONTEXT.SUCCESS]: mergeContextLines,
  [Actions.OPEN_OUTDATED_COMMENTS_DIALOG](state, action) {
    return {
      ...state,
      isOutdatedDialogOpen: true,
      outdatedCommentsDialog: action.payload,
    };
  },
  [Actions.OPEN_DIFF_COMMENTS_DIALOG](state, action) {
    return {
      ...state,
      isDiffCommentsDialogOpen: true,
      diffCommentsDialog: action.payload,
    };
  },
  [Actions.OPEN_NONRENDERED_DIFF_COMMENTS_DIALOG](state, action) {
    return {
      ...state,
      isNonRenderedDiffCommentsDialogOpen: true,
      nonRenderedDiffCommentsDialogFilepath: action.payload,
    };
  },
  [Actions.CLOSE_OUTDATED_COMMENTS_DIALOG](state, _action) {
    return {
      ...state,
      isOutdatedDialogOpen: false,
    };
  },
  [Actions.CLOSE_DIFF_COMMENTS_DIALOG](state, _action) {
    return {
      ...state,
      isDiffCommentsDialogOpen: false,
    };
  },
  [Actions.CLOSE_NONRENDERED_DIFF_COMMENTS_DIALOG](state, _action) {
    return {
      ...state,
      isNonRenderedDiffCommentsDialogOpen: false,
    };
  },
  [Actions.LOAD_DIFFSTAT.REQUEST](state) {
    return {
      ...state,
      diffStatError: '',
    };
  },
  [Actions.LOAD_DIFFSTAT.ERROR](state, action) {
    const {
      payload: { errorCode, diffStatErrorMessage },
    } = action;

    return {
      ...state,
      errorCode,
      diffStatError: diffStatErrorMessage,
      isLoading: false,
    };
  },
  [Actions.LOAD_DIFFSTAT.SUCCESS](state, action) {
    const { values } = action.payload;
    return {
      ...state,
      diffStatError: '',
      diffStat: values,
      // The TOGGLE_SINGLE_FILE_MODE change is sent before LOAD_DIFFSTAT.SUCCESS,
      // so state.isSingleFileMode can be safely used here. This ensures that
      // a file is selected in the sidebar if in single file mode.
      activeDiff: activeDiffSetToFirstFile(
        state,
        state.isSingleFileMode,
        values
      ),
    };
  },
  [Actions.TOGGLE_SINGLE_FILE_MODE](state, action) {
    const isSingleFileMode = action.payload;
    return {
      ...state,
      isSingleFileMode,
      // This ensures that a file is selected in the sidebar if in single file mode.
      activeDiff: activeDiffSetToFirstFile(state, isSingleFileMode),
    };
  },
  [Actions.TOGGLE_SINGLE_FILE_MODE_ELIGIBILITY](state, action) {
    return {
      ...state,
      isSingleFileModeEligible: action.payload,
    };
  },
  [Actions.TOGGLE_SINGLE_FILE_MODE_SETTINGS_HEADER_VISIBILITY](state, action) {
    return {
      ...state,
      isSingleFileModeSettingsHeaderVisible: action.payload,
    };
  },
  [Actions.TOGGLE_STICKY_HEADER_ACTIVE_STATUS](state, action) {
    return {
      ...state,
      isStickyHeaderActive: action.payload,
    };
  },
  [Actions.HIGHLIGHT_ACTIVE_TREE_ITEM](state, action) {
    return {
      ...state,
      activeDiff: action.payload,
    };
  },
  [Actions.RESTORE_DIFFS_EXPAND_STATE](state, action) {
    return {
      ...state,
      diffsExpansionState: action.payload,
    };
  },

  [Actions.SCROLL_TO_FILE](state, action) {
    const { payload: anchorId } = action;
    const filepath = anchorId.replace(/chg-/, '');
    const nextExpansionState = {
      ...state.diffsExpansionState,
      [filepath]: true,
    };
    const activeDiff = state.isSingleFileMode ? anchorId : state.activeDiff;
    return { ...state, diffsExpansionState: nextExpansionState, activeDiff };
  },
  [Actions.OPEN_FILE_COMMENT](state, action) {
    const filepath = action.payload;

    const nextExpansionState = {
      ...state.diffsExpansionState,
      [filepath]: true,
    };

    const nextDiffCommentingMap = {
      ...state.diffCommentingMap,
      [filepath]: true,
    };

    return {
      ...state,
      diffsExpansionState: nextExpansionState,
      diffCommentingMap: nextDiffCommentingMap,
    };
  },
  [Actions.CLOSE_FILE_COMMENT](state, action) {
    const filepath = action.payload;

    const nextDiffCommentingMap = {
      ...state.diffCommentingMap,
      [filepath]: false,
    };

    return {
      ...state,
      diffCommentingMap: nextDiffCommentingMap,
    };
  },
  [Actions.TOGGLE_DIFF_EXPANSION](state, action) {
    const { filepath, isOpening } = action.payload;

    if (state.diffsExpansionState[filepath] === isOpening) {
      return state;
    }

    const nextExpansionState = {
      ...state.diffsExpansionState,
      [filepath]: isOpening,
    };
    return { ...state, diffsExpansionState: nextExpansionState };
  },
  [Actions.COLLAPSE_ALL_DIFFS](state) {
    const allFilepaths = (state.diffStat || []).map(extractFilepath);
    const allFilesCollapsed = allFilepaths.reduce(
      (prev, filepath) => ({
        ...prev,
        [filepath]: false,
      }),
      {}
    );

    return {
      ...state,
      diffsExpansionState: allFilesCollapsed,
    };
  },
  [Actions.EXPAND_ALL_DIFFS](state) {
    const allFilepaths = (state.diffStat || []).map(extractFilepath);
    const allFilesExpanded = allFilepaths.reduce(
      (prev, filepath) => ({
        ...prev,
        [filepath]: true,
      }),
      {}
    );

    return {
      ...state,
      diffsExpansionState: allFilesExpanded,
    };
  },
  [Actions.RESET_ACTIVE_TREE_ITEM](state, action) {
    if (state.activeDiff && state.activeDiff === action.payload) {
      return {
        ...state,
        activeDiff: '',
      };
    } else {
      return state;
    }
  },
  [Actions.LOAD_WATCH.BEGIN](state) {
    return {
      ...state,
      watchActionLoading: true,
    };
  },
  [Actions.LOAD_WATCH.END](state, action) {
    return {
      ...state,
      isWatching: action.payload,
      watchActionLoading: false,
    };
  },
  [Actions.ACTIVE_DIFF_PERMALINK](state, action) {
    return {
      ...state,
      activePermalink: action.payload,
    };
  },
  [Actions.PERMALINK_HASH_CHANGE](state, action) {
    const permalink = action.payload;
    if (LINE_PERMALINK_MATCHER.test(permalink)) {
      return {
        ...state,
        activePermalink: permalink,
      };
    } else {
      return state;
    }
  },
  [Actions.UPDATE_BUILDS](state, action) {
    return {
      ...state,
      builds: action.payload,
    };
  },
  [LoadGlobal.SUCCESS](state, action) {
    return {
      ...state,
      isWelcomeDialogOpen: action.payload.result.isCodeReviewWelcomeDialogOpen,
    };
  },
  [Actions.CLOSE_CODE_REVIEW_WELCOME_DIALOG](state) {
    return {
      ...state,
      isWelcomeDialogOpen: false,
    };
  },
  [Actions.TOGGLE_SIDE_BY_SIDE_MODE](state, action) {
    if (!action.payload.filePath) {
      return state;
    }
    const { filePath, isSideBySide } = action.payload;

    return {
      ...state,
      sideBySideDiffState: {
        ...state.sideBySideDiffState,
        [filePath]: isSideBySide,
      },
    };
  },
  [UPDATE_GLOBAL_DIFF_VIEW_MODE_SUCCESS](state) {
    return {
      ...state,
      sideBySideDiffState: initialState.sideBySideDiffState,
    };
  },
  [Actions.UPDATE_EDITOR_OPEN_STATE](state, action) {
    return {
      ...state,
      isEditorOpen: action.payload,
    };
  },
  [Actions.FETCH_BRANCH_SYNC_INFO.SUCCESS](state, action) {
    return {
      ...state,
      branchSyncInfo: {
        behind: action.payload.behind,
        behindTruncated: action.payload.behind_truncated,
      },
    };
  },
  [Actions.REVERT_DIALOG.OPEN](state) {
    return {
      ...state,
      isRevertDialogOpen: true,
      revertError: null,
    };
  },
  [Actions.REVERT_DIALOG.CLOSE](state) {
    return {
      ...state,
      isRevertDialogOpen: false,
    };
  },
  [Actions.REVERT_PULL_REQUEST.REQUEST](state) {
    return {
      ...state,
      revertError: null,
    };
  },
  [Actions.REVERT_PULL_REQUEST.ERROR](state, action) {
    return {
      ...state,
      revertError: action.payload,
    };
  },
  [Actions.FETCH_DESTINATION_BRANCH.SUCCESS](state) {
    return {
      ...state,
      hasDestinationBranch: true,
    };
  },
  [Actions.FETCH_DESTINATION_BRANCH.ERROR](state) {
    return {
      ...state,
      hasDestinationBranch: false,
    };
  },
  [Actions.SET_WELCOME_TOUR_ACTIVE](state, action) {
    return {
      ...state,
      isWelcomeTourActive: action.payload,
    };
  },
  [FetchSourceRepositoryDetails.SUCCESS](state, { payload }) {
    return {
      ...state,
      sourceRepository: {
        accessLevel: payload.access_level,
      },
    };
  },
  [Actions.FETCH_SOURCE_BRANCH_DETAILS.SUCCESS](state, action) {
    return {
      ...state,
      sourceBranchDetails: action.payload.values[0],
    };
  },
});
