import { get } from 'lodash-es';
import { createSelector, Selector } from 'reselect';
import { denormalize } from 'normalizr';
import createCachedSelector from 're-reselect';

import { MergeCheck, Conflict } from 'src/types';
import { PullRequest, Repository } from 'src/components/types';
import {
  CodeReviewConversation,
  FabricConversation,
  ApiComment,
  CommentLikes,
} from 'src/components/conversation-provider/types';
import { Diff } from 'src/types/pull-request';
import { DiffStat } from 'src/types/diffstat';
import { BucketState } from 'src/types/state';
import {
  commentLikes as commentLikesSchema,
  pullRequest as pullRequestSchema,
} from 'src/redux/pull-request/schemas';
import {
  EXCESSIVE_DIFF_FILE_COUNT,
  SINGLE_FILE_MODE_EXCESSIVE_DIFF_FILE_COUNT,
} from 'src/constants/diffs';
import { getIsMobileHeaderActive } from 'src/selectors/global-selectors';
import {
  DiffViewMode,
  getGlobalDiffViewMode,
  getGlobalShouldIgnoreWhitespace,
} from 'src/redux/pull-request-settings';
import {
  getArePullRequestRenderingLimitsActive,
  getSkipExcessiveDiffs,
  getIsDiffStatEscapedFilePathsEnabled,
} from 'src/selectors/feature-selectors';
import {
  getRepository,
  getEntities,
} from 'src/selectors/state-slicing-selectors';
import { countAllAddedAndDeletedLines } from 'src/utils/count-diff-lines';
import { extractFilepath } from 'src/utils/extract-file-path';
import { truncateDiffsByOverallLineCount } from 'src/utils/truncate-diffs';
import urls from 'src/urls/source';
import {
  getCurrentRepositoryOwnerName,
  getCurrentRepositorySlug,
  getHasRepositoryDirectAccess,
  getHasRepositoryGroupAccess,
  getRepositoryAccessLevel,
} from 'src/selectors/repository-selectors';
import { getFilepathAnchorId } from 'src/utils/permalink-helpers';

import { PullRequestState } from '../reducer';
import { DiffStateMap } from '../actions';
import { formatAllComments } from '../utils/comments';
import {
  getDiffPath,
  getDiffStatPath,
  DiffStatPathType,
} from '../utils/get-diff-path';
import { defaultDiff as defaultDiffProps } from '../utils/default-diff';
import {
  areLocatorsEqual,
  toPullRequestLocator,
  RouteParams,
} from './locator-utils';

export type PRSelector<T> = Selector<BucketState, T>;

export const getPullRequestSlice: PRSelector<PullRequestState> = createSelector(
  getRepository,
  repository => repository.pullRequest
);

export const getAllRawComments: PRSelector<ApiComment[]> = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.rawComments
);

export const getDefaultMergeStrategy: PRSelector<
  string | null | undefined
> = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.defaultMergeStrategy
);

export const getDiffsExpansions: PRSelector<DiffStateMap> = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.diffsExpansionState
);

const getCurrentPullRequestKey: PRSelector<
  string | null | undefined
> = createSelector(getPullRequestSlice, prSlice => prSlice.currentPullRequest);

export const getCurrentPullRequest: PRSelector<
  PullRequest | undefined
> = createSelector(getCurrentPullRequestKey, getEntities, (key, entities) =>
  denormalize(key, pullRequestSchema, entities)
);

export const getActiveDiff = createSelector(
  getPullRequestSlice,
  pullRequest => pullRequest.activeDiff
);

export const getCurrentPullRequestId = createSelector(
  getCurrentPullRequest,
  currentPullRequest => (currentPullRequest ? currentPullRequest.id : null)
);

export const getCurrentPullRequestTitle = createSelector(
  getCurrentPullRequest,
  currentPullRequest => (currentPullRequest ? currentPullRequest.title : null)
);

export const getCurrentPullRequestAnnotations = createSelector(
  getPullRequestSlice,
  pullRequest => (pullRequest ? pullRequest.annotations : null)
);

export const getCurrentPullRequestAnnotationsForFile = createCachedSelector(
  getCurrentPullRequestAnnotations,
  (_state: BucketState, filePath: string | undefined) => filePath,
  (annotations, filePath) =>
    annotations && filePath
      ? annotations.filter(annotation => annotation.path === filePath)
      : undefined
)((_state, filePath) => filePath || '');

export const getIsPipelinesEnabled = createSelector(
  getPullRequestSlice,
  pullRequest => (pullRequest ? pullRequest.isPipelinesEnabled : false)
);

export const getIsPipelinesPremium = createSelector(
  getPullRequestSlice,
  pullRequest => (pullRequest ? pullRequest.isPipelinesPremium : false)
);

export const getCurrentCodeInsightsReports = createSelector(
  getPullRequestSlice,
  pullRequest => (pullRequest ? pullRequest.codeInsightsReports || [] : [])
);

export const getCurrentCodeInsightsReportsLoadingState = createSelector(
  getPullRequestSlice,
  pullRequest =>
    pullRequest ? pullRequest.isCodeInsightsReportsLoading : false
);

export const getHasCodeInsightsReportsError = createSelector(
  getPullRequestSlice,
  pullRequest =>
    pullRequest ? !!pullRequest.hasCodeInsightsReportsError : false
);

export const getCurrentCodeInsightsAnnotations = createSelector(
  getPullRequestSlice,
  pullRequest => (pullRequest ? pullRequest.codeInsightsAnnotations || {} : {})
);

export const getCurrentCodeInsightsAnnotationsLoadingState = createSelector(
  getPullRequestSlice,
  pullRequest =>
    pullRequest ? pullRequest.isCodeInsightsAnnotationsLoading : false
);

export const getCurrentPullRequestAuthor = createSelector(
  getCurrentPullRequest,
  currentPullRequest => (currentPullRequest ? currentPullRequest.author : null)
);

export const getCurrentPullRequestParticipants = createSelector(
  getCurrentPullRequest,
  pullRequest => (pullRequest ? pullRequest.participants || [] : [])
);

export const getCurrentPullRequestApprovers = createSelector(
  getCurrentPullRequestAuthor,
  getCurrentPullRequestParticipants,
  (author, participants) => {
    // @ts-ignore TODO: fix noImplicitAny error here
    const isNotAuthor = participant =>
      participant.user && author && participant.user.uuid !== author.uuid;
    // @ts-ignore TODO: fix noImplicitAny error here
    const isReviewer = participant =>
      participant.role === 'REVIEWER' || participant.approved;
    const reviewers = participants.filter(
      participant => isReviewer(participant) && isNotAuthor(participant)
    );
    return reviewers.filter(reviewer => reviewer.approved);
  }
);

export const getLastPullRequestRetrievalTime = (state: BucketState) =>
  state.repository.pullRequest.lastPullRequestRetrieved;

export const getCurrentPullRequestError = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.getError
);

export const getCurrentPullRequestCreatedOnDate = createSelector(
  getCurrentPullRequest,
  currentPullRequest =>
    currentPullRequest ? currentPullRequest.created_on : null
);

export const getCurrentPullRequestUrlPieces = createSelector(
  getCurrentPullRequest,
  pullRequest => {
    const FALLBACK_REPO = { full_name: '/', owner: { uuid: undefined } };
    const destRepo: Repository = get(
      pullRequest,
      'destination.repository',
      // This repo object has so many nullable fields to traverse
      (FALLBACK_REPO as unknown) as Repository
    );
    const ownerUuid = destRepo.owner ? destRepo.owner.uuid : undefined;

    return {
      owner: destRepo.full_name.split('/')[0],
      ownerUuid,
      slug: destRepo.full_name.split('/')[1],
      repoUuid: destRepo.uuid,
      id: pullRequest ? pullRequest.id : undefined,
    };
  }
);

export const getPullRequestSourceRepo = createSelector(
  getCurrentPullRequest,
  pullRequest => pullRequest?.source?.repository || null
);

export const getPullRequestSourceRepoUuid = createSelector(
  getPullRequestSourceRepo,
  sourceRepo => sourceRepo?.uuid || undefined
);

export const getPullRequestDestinationRepo = createSelector(
  getCurrentPullRequest,
  pullRequest => pullRequest?.destination?.repository || null
);

export const getPullRequestDestinationRepoUuid = createSelector(
  getPullRequestDestinationRepo,
  repository => repository?.uuid
);

export const getPullRequestSourceHash: PRSelector<
  string | null
> = createSelector(getCurrentPullRequest, pullRequest =>
  get(pullRequest, 'source.commit.hash', null)
);

export const getCodeInsightsDiscoveryUrl = createSelector(
  getCurrentPullRequest,
  pullRequest =>
    `${urls.ui.edit(
      get(pullRequest, 'source.repository.full_name', null),
      get(pullRequest, 'source.commit.hash', null),
      'bitbucket-pipelines.yml',
      { at: { name: get(pullRequest, 'source.branch.name', null) } }
    )}&showCodeInsightsPipes=true`
);

export const getCodeInsightsAnnotationUrl = createSelector(
  getCurrentPullRequest,
  pullRequest => (path: string) =>
    urls.ui.source(pullRequest?.source?.repository?.full_name || '', {
      refOrHash: pullRequest?.source?.commit?.hash,
      path,
      at: pullRequest?.source?.branch?.name,
    })
);

export const getCodeInsightsPipelinesUrl = createSelector(
  getCurrentPullRequest,
  pullRequest =>
    `/${get(pullRequest, 'source.repository.full_name', null)}` +
    `/addon/pipelines-installer/#!/?from=codeInsightsCard`
);

export const getPullRequestDestinationHash: PRSelector<
  string | null
> = createSelector(getCurrentPullRequest, pullRequest =>
  get(pullRequest, 'destination.commit.hash', null)
);

export const getCurrentPullRequestSpec = createSelector(
  getPullRequestSourceHash,
  getPullRequestDestinationHash,
  (sourceHash, destinationHash) => {
    if (!sourceHash || !destinationHash) {
      return null;
    }
    return `${sourceHash}..${destinationHash}`;
  }
);

export const getPullRequestBranchName = createSelector(
  getCurrentPullRequest,
  pullRequest => (pullRequest ? pullRequest.source.branch.name : '')
);

export const getDestinationBranchName = createSelector(
  getCurrentPullRequest,
  pullRequest => (pullRequest ? pullRequest.destination.branch.name : '')
);

export const getPullRequestCompareSpecDiffUrl = createSelector(
  getCurrentPullRequest,
  pullRequest => (pullRequest ? pullRequest.links.diff.href : undefined)
);

export const getPullRequestCompareSpecDiffStatUrl = createSelector(
  getCurrentPullRequest,
  pullRequest => (pullRequest ? pullRequest.links.diffstat.href : undefined)
);

export const getIsDifferentRepo = createSelector(
  getPullRequestSourceRepo,
  getPullRequestDestinationRepo,
  (sourceRepo, destinationRepo) => {
    const source = get(sourceRepo, 'uuid');
    const destination = get(destinationRepo, 'uuid');

    return !source || !destination || source !== destination;
  }
);

export const getIsSingleFileModeActive = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.isSingleFileMode
);

export const getIsSingleFileModeEligible = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.isSingleFileModeEligible
);

// For the buildFiles() selector we only need the activeDiff value when the PR
// is being viewed in single file mode. When *not* in single file mode, the
// activeDiff can be updated by scrolling the page, which can lead to the
// entire diff re-rendering due to activeDiff invalidating the caching of
// the selectors passed to buildFiles().
export const getSingleFileModeActiveDiff = createSelector(
  getIsSingleFileModeActive,
  getActiveDiff,
  (isSingleFileModeActive: boolean, activeDiff: string) =>
    isSingleFileModeActive ? activeDiff : undefined
);

export const getIsSingleFileModeSettingsHeaderVisible = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.isSingleFileModeSettingsHeaderVisible
);

export const getIsStickyHeaderActive = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.isStickyHeaderActive
);

export const getConflicts = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.conflicts
);

export const getConflictStatus = createSelector(
  getConflicts,
  conflicts => conflicts.length > 0
);

export const getPullRequestMergeChecks = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.mergeChecks
);

export const getPullRequestMergeChecksIsMergeable = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.isMergeable
);

export const getPullRequestCanCurrentUserMerge = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.canCurrentUserMerge
);

export const getCountFailedPullRequestMergeChecks = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.mergeChecks.filter((item: MergeCheck) => !item.pass).length
);

export const getPullRequestIsMergeable = createSelector(
  getPullRequestMergeChecks,
  getConflicts,
  (mergeChecks, conflicts) => {
    return (
      conflicts.length === 0 &&
      mergeChecks.length > 0 &&
      mergeChecks.filter(mergeCheck => !mergeCheck.pass).length === 0
    );
  }
);

export const getPullRequestMergeChecksLoadingState = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.isMergeChecksLoading
);

export const getPullRequestMergeChecksError = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.mergeChecksError
);

export const getPullRequestDiff = createSelector(
  getPullRequestSlice,
  pullRequest => pullRequest.diff
);

export const getPullRequestDiffFileCount = createSelector(
  getPullRequestDiff,
  diff => diff.length
);

export const getPullRequestDiffLinesCount = createSelector(
  getPullRequestDiff,
  (diff: Diff[]) => countAllAddedAndDeletedLines(diff)
);

const getDiffStat = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.diffStat
);

export const getUntruncatedPullRequestDiffFileCount = createSelector(
  getDiffStat,
  diffStat => diffStat?.length || 0
);

const getFileTruncatedDiffStat = createSelector(
  getDiffStat,
  getIsSingleFileModeActive,
  (diffStats, isSingleFileModeActive) =>
    diffStats
      ? diffStats.slice(
          0,
          isSingleFileModeActive
            ? SINGLE_FILE_MODE_EXCESSIVE_DIFF_FILE_COUNT
            : EXCESSIVE_DIFF_FILE_COUNT
        )
      : null
);

export const getDiffStatError = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.diffStatError
);

export const getActivePermalink = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.activePermalink
);

const getFileAndLineTruncatedPullRequestDiff = createSelector(
  getFileTruncatedDiffStat,
  getPullRequestDiff,
  getSkipExcessiveDiffs,
  getIsSingleFileModeActive,
  getIsDiffStatEscapedFilePathsEnabled,
  (
    diffStats,
    diffs,
    skipExcessiveDiffs,
    isSingleFileModeActive,
    isDiffStatEscapedFilePathsEnabled
  ) => {
    if (!diffStats || diffStats.length === 0) {
      return [];
    }

    /**
     * The diffstat is the base source of truth for files that will be rendered in the PR
     * because when "ignore whitespace" is enabled, files with whitespace-only changes will
     * not be present in the full diff.
     *
     * The rendered files might be further filtered based on the overall # of lines, which we
     * calculate below.
     */
    const filteredDiffStats = diffStats.map(stat =>
      getDiffStatPath(
        stat,
        isDiffStatEscapedFilePathsEnabled
          ? DiffStatPathType.Escaped
          : DiffStatPathType.Unescaped
      )
    );
    const filteredDiffs = diffs.filter(
      diff => filteredDiffStats.indexOf(getDiffPath(diff)) !== -1
    );

    return truncateDiffsByOverallLineCount(filteredDiffs, {
      skipExcessiveDiffs,
      isSingleFileModeActive,
    });
  }
);

export const getRenderedPullRequestDiff = createSelector(
  getArePullRequestRenderingLimitsActive,
  getPullRequestDiff,
  getFileAndLineTruncatedPullRequestDiff,
  getDiffStat,
  getIsDiffStatEscapedFilePathsEnabled,
  getIsSingleFileModeActive,
  getSingleFileModeActiveDiff,
  (
    areLimitsActive,
    diffs,
    limitedDiffs,
    diffStats,
    isDiffStatEscapedFilePathsEnabled,
    isSingleFileModeActive,
    activeDiff
  ) => {
    const relevantDiffs = areLimitsActive ? limitedDiffs : diffs;
    if (isSingleFileModeActive && activeDiff) {
      let singleDiff;
      if (isDiffStatEscapedFilePathsEnabled) {
        if (!diffStats) {
          return [];
        }
        const singleDiffStat = diffStats.find(
          stat =>
            getFilepathAnchorId(
              getDiffStatPath(stat, DiffStatPathType.Unescaped)
            ) === activeDiff
        );
        if (singleDiffStat) {
          singleDiff = relevantDiffs.find(
            diff =>
              getDiffPath(diff) ===
              getDiffStatPath(singleDiffStat, DiffStatPathType.Escaped)
          );
        }
      } else {
        singleDiff = relevantDiffs.find(
          diff => getFilepathAnchorId(extractFilepath(diff)) === activeDiff
        );
      }
      return singleDiff ? [singleDiff] : [];
    }
    return relevantDiffs;
  }
);

const getFileAndLineTruncatedDiffStat = createSelector(
  getPullRequestDiff,
  getFileAndLineTruncatedPullRequestDiff,
  getFileTruncatedDiffStat,
  getIsDiffStatEscapedFilePathsEnabled,
  (allDiffs, diffs, diffStats, isDiffStatEscapedFilePathsEnabled) => {
    if (!diffStats || diffStats.length === 0) {
      return [];
    }

    /**
     * If there are files in the truncated diffstat but not the truncated diff, there are 2 possibilities
     *
     * A) The remaining files present all have whitespace-only changes and "ignore whitespace" is enabled.
     *    In this case, we want to return the diffstat without further changes.
     *
     * B) The 1st file in the diff is rendered, but exceeds the limit on the # of lines for the entire diff.
     *    This should not be possible. The per-file limit should always be at or below the entire diff limit.
     */
    if (diffs.length === 0) {
      return diffStats;
    }

    // If we didn't truncate the diff due to the # of lines, just return the full diffstat to avoid
    // accidentally dropping files with whitespace-only changes if they're at the end of the diff
    if (diffs.length === allDiffs.length) {
      return diffStats;
    }

    /**
     * Find the path of the last file diff that we render, taking our client-side limits
     * into account, and only return entries in the diffstat up to that file.
     *
     * We can't just filter the diffstat by paths present in the the full diff because when
     * "ignore whitespace" is enabled, files with whitespace-only changes will not be present
     * in the full diff.
     */
    const limitBreakingDiffIndex = diffs.length;
    // This is the path of the 1st file that's not included in the truncated diff
    const limitBreakingDiffPath = getDiffPath(allDiffs[limitBreakingDiffIndex]);

    const cutoffIndex = diffStats
      .map(stat =>
        getDiffStatPath(
          stat,
          isDiffStatEscapedFilePathsEnabled
            ? DiffStatPathType.Escaped
            : DiffStatPathType.Unescaped
        )
      )
      .indexOf(limitBreakingDiffPath);

    // If a file in the diff isn't found in the diffstat, something is wrong.
    // Fall back to returning an unfiltered diffstat
    if (cutoffIndex === -1) {
      return diffStats;
    }

    // Return everything up to (but not including) the file that went over the
    // diff limit for # of lines
    return diffStats.slice(0, cutoffIndex);
  }
);

export const getRenderedDiffStat = createSelector(
  getArePullRequestRenderingLimitsActive,
  getDiffStat,
  getFileAndLineTruncatedDiffStat,
  (areLimitsActive, diffStats, limitedDiffStats) =>
    areLimitsActive ? limitedDiffStats : diffStats
);

export const getPullRequestDiffRenderedFileCount = createSelector(
  getRenderedPullRequestDiff,
  diff => diff.length
);

export const getPullRequestDiffRenderedLinesCount = createSelector(
  getRenderedPullRequestDiff,
  (diff: Diff[]) => countAllAddedAndDeletedLines(diff)
);

export const getIsPullRequestTruncated = createSelector(
  getDiffStat,
  getRenderedDiffStat,
  (diffStats, limitedDiffStats) => {
    if (!diffStats || !limitedDiffStats) {
      return false;
    }
    return limitedDiffStats.length < diffStats.length;
  }
);

const buildDiffFiles = (
  diffs: Diff[],
  diffStats: DiffStat[],
  conflicts: Conflict[],
  shouldIgnoreWhitespace: boolean,
  isSingleFileModeActive: boolean,
  singleFileModeActiveDiff: string,
  isDiffStatEscapedFilePathsEnabled: boolean
): Diff[] => {
  if (!diffStats || diffStats.length === 0) {
    return [];
  }
  const singleFileModeDiffStat =
    isSingleFileModeActive &&
    diffStats.find(
      diffStat =>
        getFilepathAnchorId(
          getDiffStatPath(diffStat, DiffStatPathType.Unescaped)
        ) === singleFileModeActiveDiff
    );
  const relevantDiffStats = singleFileModeDiffStat
    ? [singleFileModeDiffStat]
    : diffStats;

  return relevantDiffStats.map((diffStat: DiffStat) => {
    const diffStatPath = getDiffStatPath(
      diffStat,
      isDiffStatEscapedFilePathsEnabled
        ? DiffStatPathType.Escaped
        : DiffStatPathType.Unescaped
    );

    const aConflict =
      conflicts &&
      conflicts.find((conflict: Conflict) => conflict.path === diffStatPath);

    let matchingDiff =
      diffs &&
      diffs.find((diff: Diff) => {
        return diffStatPath === getDiffPath(diff);
      });

    // COREX-2109 Remove feature check
    if (matchingDiff && isDiffStatEscapedFilePathsEnabled) {
      matchingDiff = {
        ...matchingDiff,
        // We want to get the `from` and `to` values from the diffstat
        // because the diff can have escaping on certain file paths (e.g.
        // paths with tabs, emojis, etc. in them). The diffstat always gives
        // use the unescaped paths which we want to use from this point
        // forward for things such as posting comments, permalinking,
        // file tree, file headers, etc.
        from: diffStat.old?.path || '/dev/null',
        to: diffStat.new?.path || '/dev/null',
      };
    }

    const defaultDiff: Diff = {
      ...defaultDiffProps,
      fileDiffStatus: diffStat.status,
      from: diffStat.old?.path || '/dev/null',
      to: diffStat.new?.path || '/dev/null',
    };
    // ============================
    // WHITESPACE ONLY DIFF
    // If we are ignoring whitespace, the diff endpoint will return
    // nothing for files that only have whitespace changes.
    // In order to build out a dummy diff placeholder in the UI
    // we need to to find the whitespace-only files and stub out a 'diff'
    // ============================
    return {
      ...defaultDiff,
      ...matchingDiff,
      ...(aConflict && { isConflicted: true }),
      ...(aConflict && { conflictMessage: aConflict.message }),
      isFileContentsUnchanged: shouldIgnoreWhitespace && !matchingDiff,
    };
  });
};

export const getAllDiffFiles: PRSelector<Diff[]> = createSelector(
  getPullRequestDiff,
  getDiffStat,
  getConflicts,
  getGlobalShouldIgnoreWhitespace,
  () => false, // when calculating all diff files, single file mode is not relevant
  getSingleFileModeActiveDiff,
  getIsDiffStatEscapedFilePathsEnabled,
  buildDiffFiles
);

// This only retrieves the diff files that are going to be rendered in the PR,
// taking client-side limits and single file mode into account
export const getDiffFiles: PRSelector<Diff[]> = createSelector(
  getRenderedPullRequestDiff,
  getRenderedDiffStat,
  getConflicts,
  getGlobalShouldIgnoreWhitespace,
  getIsSingleFileModeActive,
  getSingleFileModeActiveDiff,
  getIsDiffStatEscapedFilePathsEnabled,
  buildDiffFiles
);

export const getWatchActionLoading = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.watchActionLoading
);

export const getWatch = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.isWatching
);

const getPullRequestPolling = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.polling
);

export const getLastPollTime = createSelector(
  getPullRequestPolling,
  prPolling => prPolling.lastPollTime
);

export const getUpdateNeeds = createSelector(
  getPullRequestPolling,
  prPolling => ({
    ...prPolling,
    lastPollTime: undefined,
  })
);

export const getOutdatedCommentsDialogFilepath = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.outdatedCommentsDialog
);

export const getDiffCommentsDialogFilepath = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.diffCommentsDialog
);

export const getNonRenderedDiffCommentsDialogFilepath = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.nonRenderedDiffCommentsDialogFilepath
);

// @ts-ignore TODO: fix noImplicitAny error here
export const findFileInDiffFiles = (diffFiles, filepath) => {
  const files = (diffFiles || []).filter(
    // @ts-ignore TODO: fix noImplicitAny error here
    file => extractFilepath(file) === filepath
  );

  return files[0];
};

export const getIsFileRemovedFromDiff = createCachedSelector(
  getDiffStat,
  (_state: BucketState, filePath: string | undefined) => filePath,
  (diffStat, filePath) => !!filePath && !findFileInDiffFiles(diffStat, filePath)
)((_state, filePath) => filePath || '');

export const getIsFileHiddenFromDiff = createCachedSelector(
  getRenderedDiffStat,
  getIsFileRemovedFromDiff,
  (_state: BucketState, filePath: string | undefined) => filePath,
  (renderedDiffStat, isFileRemovedFromDiff, filePath) =>
    !!filePath &&
    !isFileRemovedFromDiff &&
    !findFileInDiffFiles(renderedDiffStat, filePath)
)((_state, filePath) => filePath || '');

export const getOutdatedCommentsDialogFile = createSelector(
  getDiffFiles,
  getOutdatedCommentsDialogFilepath,
  (diffFiles, filepath) => {
    const outdatedDialogFile = findFileInDiffFiles(diffFiles, filepath);
    if (outdatedDialogFile) {
      return { file: outdatedDialogFile, isFileOutdated: false };
    }

    // If the requested file isn't in the diff then we will construct a basic
    // "outdated" file that has enough information to fetch the context lines.
    return {
      file: {
        headers: [],
        chunks: [],
        fileDiffStatus: null,
        from: filepath,
        to: filepath,
      },
      isFileOutdated: true,
    };
  }
);

export const getDiffCommentsDialogFile = createSelector(
  getDiffFiles,
  getDiffCommentsDialogFilepath,
  (diffFiles, filepath) => findFileInDiffFiles(diffFiles, filepath)
);

export const getNonRenderedDiffCommentsDialogFile = createSelector(
  getAllDiffFiles,
  getNonRenderedDiffCommentsDialogFilepath,
  (diffFiles, filepath) => findFileInDiffFiles(diffFiles, filepath)
);

export const getCurrentPullRequestBuilds = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.builds
);

export const getIsCorrectPullRequest = createCachedSelector(
  getCurrentPullRequestUrlPieces,
  (_state: BucketState, params: RouteParams) => params,
  (urlPieces, params) => {
    return areLocatorsEqual(urlPieces, toPullRequestLocator(params));
  }
)((_state, params: RouteParams) => {
  const { repositoryOwner, repositorySlug, pullRequestId } = params;
  return `${repositoryOwner}:${repositorySlug}:${pullRequestId}`;
});

export const getWelcomeDialogState = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.isWelcomeDialogOpen
);

export const getSideBySideDiffState = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.sideBySideDiffState
);

export const getSideBySideDiffStateForFile = createCachedSelector(
  getPullRequestSlice,
  getGlobalDiffViewMode,
  (_state: BucketState, fileName: string) => fileName,
  getIsMobileHeaderActive,
  (
    prSlice: PullRequestState,
    globalDiffViewMode: DiffViewMode,
    fileName: string,
    isMobileHeaderActive: boolean
  ) => {
    if (isMobileHeaderActive) {
      return false;
    }
    const isSideBySideEnabledForFile = prSlice.sideBySideDiffState[fileName];
    return isSideBySideEnabledForFile === undefined
      ? globalDiffViewMode === DiffViewMode.SideBySide
      : isSideBySideEnabledForFile;
  }
)((_state, fileName) => fileName);

export const getIsOutdatedDialogOpen = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.isOutdatedDialogOpen
);

export const getIsDiffCommentsDialogOpen = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.isDiffCommentsDialogOpen
);

export const getIsNonRenderedDiffCommentsDialogOpen = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.isNonRenderedDiffCommentsDialogOpen
);

export const getEditorState = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.isEditorOpen
);

export const getSourceRepositoryAccessLevel = createSelector(
  getPullRequestSlice,
  prSlice => {
    return prSlice.sourceRepository.accessLevel;
  }
);

export const getBranchSyncInfo = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.branchSyncInfo
);

export const getContainerId = createSelector(
  getCurrentRepositoryOwnerName,
  getCurrentRepositorySlug,
  getCurrentPullRequestId,
  (owner, repoSlug, pullRequestId) =>
    `ari:cloud:bitbucket:${owner}-${repoSlug}:pullrequest/${pullRequestId}`.toLowerCase()
);

export const getFabricConversationsList: PRSelector<FabricConversation[]> = createSelector(
  getAllRawComments,
  getContainerId,
  (rawComments, containerId) => {
    const { fabricConversations } = formatAllComments(rawComments, containerId);
    return fabricConversations;
  }
);

export const getContextLines = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.contextLines || []
);

export const getConversationsList: PRSelector<CodeReviewConversation[]> = createSelector(
  getAllRawComments,
  getContainerId,
  getContextLines,
  (rawComments, containerId, contextLines) => {
    const { conversations } = formatAllComments(rawComments, containerId);

    return conversations.map(convo => {
      const contextForConvo = contextLines[convo.conversationId];
      // explicit undefined check so that empty lines still count, friends don't let friends use truthiness
      if (contextForConvo === undefined) {
        return convo;
      }

      return {
        ...convo,
        meta: {
          ...convo.meta,
          context_lines: contextForConvo,
        },
      };
    });
  }
);

export const getIsWelcomeTourActive = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.isWelcomeTourActive
);

export const getIsRevertDialogOpen = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.isRevertDialogOpen
);

export const getRevertError = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.revertError
);

export const getHasDestinationBranch = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.hasDestinationBranch
);

export const getCurrentPullRequestSourceBranchDetails = createSelector(
  getPullRequestSlice,
  prSlice => prSlice.sourceBranchDetails
);

export const getCurrentPullRequestSourceBranchPermissions = createSelector(
  getCurrentPullRequestSourceBranchDetails,
  sourceBranch => (sourceBranch ? sourceBranch.permissions : null)
);

export const getCanDeleteSourceBranch = createSelector(
  getPullRequestSourceRepo,
  getPullRequestDestinationRepo,
  getCurrentPullRequestSourceBranchPermissions,
  (sourceRepo, destRepo, permissions) =>
    sourceRepo &&
    destRepo &&
    permissions &&
    sourceRepo.full_name === destRepo.full_name &&
    permissions.delete === 'allow'
);

function commentsToKey(_state: BucketState, comments: { id: number }[]) {
  if (!comments) {
    return '';
  }
  return comments.map(comment => comment.id).join(',');
}

export const getCommentLikes = createCachedSelector(
  getEntities,
  (_state: BucketState, comments: { id: number }[] | undefined) => comments,
  (entities, comments) => {
    if (!comments) {
      return [];
    }

    return comments.reduce((result, comment) => {
      const { id: commentId } = comment;
      const commentLikes = denormalize(commentId, commentLikesSchema, entities);

      if (commentLikes && commentLikes.users.length !== 0) {
        result.push(commentLikes);
      }
      return result;
    }, [] as CommentLikes[]);
  }
)(commentsToKey);

// essentially getCanCreateTask selector
export const getCanLikeComments = createSelector(
  getRepositoryAccessLevel,
  getHasRepositoryDirectAccess,
  getHasRepositoryGroupAccess,
  (accessLevel, hasDirectAccess, hasGroupAccess) => {
    // A user can like a comment if they're given explicit access to the PR's
    // "to repository."
    //
    // We can assume that if the user has write or admin privileges then they
    // were given them explicitly (the only privilege that can be implicit is
    // "read" access, which is the default for a user viewing a public repository)
    if (accessLevel === 'write' || accessLevel === 'admin') {
      return true;
    }
    return hasDirectAccess || hasGroupAccess;
  }
);
