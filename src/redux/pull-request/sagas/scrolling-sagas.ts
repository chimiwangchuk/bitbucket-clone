import { all, fork, take, put, select, delay, call } from 'redux-saga/effects';
import scrollTo, { ScrollAction } from 'src/redux/global/actions/scroll-to';
import {
  ACTIVE_DIFF_PERMALINK,
  PERMALINK_HASH_CHANGE,
  INITIAL_DIFFS_RENDERED,
  FETCH_COMMENTS,
  FETCH_DIFF,
  OPEN_OUTDATED_COMMENTS_DIALOG,
  OPEN_NONRENDERED_DIFF_COMMENTS_DIALOG,
  TOGGLE_DIFF_EXPANSION,
  SCROLL_TO_COMMENT_IN_MODAL,
  toggleSideBySideMode,
  FETCH_OUTDATED_COMMENT_CONTEXT,
  LOAD_DIFFSTAT,
  DIFFS_HAVE_RENDERED,
  HIGHLIGHT_ACTIVE_TREE_ITEM,
} from 'src/redux/pull-request/actions';

import {
  STICKY_FILE_HEIGHT,
  STICKY_HEADER_HEIGHT_OFFSET,
} from 'src/sections/repository/sections/pull-request/components/utils/calculate-header-offset';
import {
  COMMENT_PERMALINK_SCROLL_OFFSET,
  LINE_PERMALINK_SCROLL_OFFSET,
  SIDEBAR_EXPANDER_SCROLL_OFFSET,
  PERMALINK_DELAY,
} from 'src/constants/permalink-scroll';

import {
  COMMENT_PERMALINK_MATCHER,
  SIDEBAR_EXPANDER_HASH_MATCHER,
  LINE_PERMALINK_MATCHER,
  SIDE_BY_SIDE_LINE_PERMALINK_MATCHER,
  FILEPATH_PERMALINK_MATCHER,
  getPermalink,
  getFilepath,
  getFilepathAnchorId,
  updateHashInURL,
} from 'src/utils/permalink-helpers';

import {
  getCommentsMetaData,
  CommentsMetaData,
} from 'src/selectors/conversation-selectors';

import {
  getDiffsExpansions,
  getActiveDiff,
  getAllDiffFiles,
  getIsOutdatedDialogOpen,
  getIsNonRenderedDiffCommentsDialogOpen,
  getDiffFiles,
  findFileInDiffFiles,
  getIsSingleFileModeActive,
  getSingleFileModeActiveDiff,
} from 'src/redux/pull-request/selectors';
import { Diff } from 'src/types/pull-request';
import { getIsDiffStatEscapedFilePathsEnabled } from 'src/selectors/feature-selectors';

// If trying to scroll to a line in a file that is different to the current
// single-file-mode file, switch to the correct file first and wait for its
// anchor to render. This is a no-op if single file mode is not active.
export function* switchSingleFileModeFileBeforeScrolling(filePath: string) {
  const singleFileModeActiveDiff = yield select(getSingleFileModeActiveDiff);
  if (singleFileModeActiveDiff && filePath !== singleFileModeActiveDiff) {
    yield put({ type: HIGHLIGHT_ACTIVE_TREE_ITEM, payload: filePath });
    yield take(DIFFS_HAVE_RENDERED);
    yield delay(PERMALINK_DELAY);
  }
}

export const scrollPastStickyHeaders = (permalink: string) => {
  let offsetToApply = STICKY_HEADER_HEIGHT_OFFSET + STICKY_FILE_HEIGHT;

  if (LINE_PERMALINK_MATCHER.test(permalink)) {
    offsetToApply += LINE_PERMALINK_SCROLL_OFFSET;
  } else if (COMMENT_PERMALINK_MATCHER.test(permalink)) {
    offsetToApply += COMMENT_PERMALINK_SCROLL_OFFSET;
  } else if (SIDEBAR_EXPANDER_HASH_MATCHER.test(permalink)) {
    offsetToApply = SIDEBAR_EXPANDER_SCROLL_OFFSET;
  }
  /**
   * This is a scroll behavior function that takes the numbers provided
   * by smooth-scroll-into-view-if-needed library and performs a custom scroll.
   * @param {*} actions See https://www.npmjs.com/package/scroll-into-view-if-needed#function
   */
  const customScrollBehavior = (actions: ScrollAction) => {
    // @ts-ignore TODO: fix noImplicitAny error here
    actions.forEach(({ el, top }) => {
      if (top - offsetToApply >= 0) {
        el.scrollTop = top - offsetToApply;
        offsetToApply = 0;
      } else {
        offsetToApply = offsetToApply - top;
        el.scrollTop = 0;
      }
    });
  };

  return customScrollBehavior;
};

function* openPermalinksFile(filepath: string | undefined) {
  const expansions = yield select(getDiffsExpansions);

  if (filepath && expansions[filepath] !== true) {
    yield put({
      type: TOGGLE_DIFF_EXPANSION,
      payload: {
        filepath,
        isOpening: true,
      },
    });
  }
}

// @ts-ignore TODO: fix noImplicitAny error here
export function* scrollToFileThenToPermalink(targetId, permalink) {
  if (SIDE_BY_SIDE_LINE_PERMALINK_MATCHER.test(permalink)) {
    yield put(
      toggleSideBySideMode({
        filePath: getFilepath(permalink),
        isSideBySide: true,
      })
    );
  }
  // If the permalink exists in the DOM then the diff has rendered
  // so no need to scroll to the file first.
  const permalinkElement = document.getElementById(permalink);
  if (permalinkElement) {
    yield put(
      scrollTo({
        targetId: permalink,
        customBehavior: scrollPastStickyHeaders(permalink),
      })
    );
  } else {
    // delay for file anchors to render
    yield delay(PERMALINK_DELAY);
    yield put(scrollTo({ targetId }));
    // adjust for rendering delays
    yield delay(PERMALINK_DELAY);
    yield put(
      scrollTo({
        targetId: permalink,
        customBehavior: scrollPastStickyHeaders(permalink),
      })
    );
  }
}

export function* scrollToLine() {
  const permalink = getPermalink() || '';

  if (!permalink || !LINE_PERMALINK_MATCHER.test(permalink)) {
    return;
  }
  const filepath = getFilepath(permalink);
  yield call(
    switchSingleFileModeFileBeforeScrolling,
    getFilepathAnchorId(filepath)
  );
  yield call(openPermalinksFile, filepath);

  const targetId = permalink && getFilepathAnchorId(filepath);
  if (targetId) {
    yield call(scrollToFileThenToPermalink, targetId, permalink);
  }
}

// @ts-ignore TODO: fix noImplicitAny error here
export function* scrollToFile(targetId) {
  // delay for file anchors to render
  yield delay(PERMALINK_DELAY);
  yield put(scrollTo({ targetId }));
  // adjust for rendering delays
  yield delay(PERMALINK_DELAY);
  yield put(scrollTo({ targetId }));
}

export function* scrollToFilepath() {
  const permalink = getPermalink() || '';

  if (!permalink || !FILEPATH_PERMALINK_MATCHER.test(permalink)) {
    return;
  }

  yield call(switchSingleFileModeFileBeforeScrolling, permalink);
  yield call(openPermalinksFile, permalink.replace(/chg-/, ''));
  yield call(scrollToFile, permalink);
}

export function* scrollToOutdatedComment(filepath: string) {
  yield put({ type: OPEN_OUTDATED_COMMENTS_DIALOG, payload: filepath });
}

export function* scrollToCommentOnNonRenderedFile(filepath: string) {
  yield put({ type: OPEN_NONRENDERED_DIFF_COMMENTS_DIALOG, payload: filepath });
}

export function* scrollToComment(): Generator {
  const permalink = getPermalink() || '';

  if (!permalink || !COMMENT_PERMALINK_MATCHER.test(permalink)) {
    return;
  }

  const allDiffFiles = (yield select(getAllDiffFiles)) as Diff[];
  const diffFiles = (yield select(getDiffFiles)) as Diff[];
  const commentsMetaData = (yield select(
    getCommentsMetaData
  )) as CommentsMetaData[];

  const isOutdatedCommentsDialogOpen = yield select(getIsOutdatedDialogOpen);
  const isNonRenderedDiffCommentsDialogOpen = yield select(
    getIsNonRenderedDiffCommentsDialogOpen
  );

  const matchingCommentForPermalink =
    commentsMetaData &&
    commentsMetaData.filter(
      // @ts-ignore TODO: fix noImplicitAny error here
      commentMetaData => commentMetaData.permalink === permalink
    )[0];

  const isFilePresentButNotRendered =
    matchingCommentForPermalink &&
    matchingCommentForPermalink.filepath &&
    findFileInDiffFiles(allDiffFiles, matchingCommentForPermalink.filepath) &&
    !findFileInDiffFiles(diffFiles, matchingCommentForPermalink.filepath);

  const isCommentInOutdatedFile =
    matchingCommentForPermalink &&
    matchingCommentForPermalink.filepath &&
    !findFileInDiffFiles(allDiffFiles, matchingCommentForPermalink.filepath);

  const shouldShowOutdatedCommentsDialog =
    (matchingCommentForPermalink && matchingCommentForPermalink.isOutdated) ||
    isCommentInOutdatedFile;

  // global comment
  let targetId = permalink;

  if (matchingCommentForPermalink && matchingCommentForPermalink.filepath) {
    // inline or file-level comment
    targetId = getFilepathAnchorId(matchingCommentForPermalink.filepath);
  }

  // If the file is in the full set of diff files but not in the rendered set,
  // open a modal to show the comment(s) since there's nothing to scroll to
  if (isFilePresentButNotRendered) {
    const singleFileModeActiveDiff = yield select(getSingleFileModeActiveDiff);
    if (singleFileModeActiveDiff && singleFileModeActiveDiff !== targetId) {
      yield call(switchSingleFileModeFileBeforeScrolling, targetId);
      yield fork(scrollToComment); // scrollToComment
    } else if (!isNonRenderedDiffCommentsDialogOpen) {
      yield fork(
        scrollToCommentOnNonRenderedFile,
        matchingCommentForPermalink.filepath
      );
    }
  } else if (shouldShowOutdatedCommentsDialog) {
    // If the comment is outdated, open that modal otherwise scroll to the file
    // & then the comment in it.
    if (!isOutdatedCommentsDialogOpen) {
      // Only scroll the page & open the modal dialog if it is not already open.
      // This helps prevent the UI from moving all over the place if a user clicks
      // on a comment permalink inside the outdated comments modal dialog.
      if (!isCommentInOutdatedFile) {
        // If the comment is in an outdated file, don't scroll to it since
        // it isn't in shown in the diff set
        yield call(scrollToFile, targetId);
      }
      yield fork(scrollToOutdatedComment, matchingCommentForPermalink.filepath);
    }
  } else {
    if (matchingCommentForPermalink && matchingCommentForPermalink.filepath) {
      yield call(openPermalinksFile, matchingCommentForPermalink.filepath);
    }
    yield fork(scrollToFileThenToPermalink, targetId, permalink);
  }
}

export function* scrollToGenericPermalink() {
  const permalink = getPermalink() || '';

  if (
    !permalink ||
    LINE_PERMALINK_MATCHER.test(permalink) ||
    COMMENT_PERMALINK_MATCHER.test(permalink) ||
    FILEPATH_PERMALINK_MATCHER.test(permalink)
  ) {
    return;
  }

  // delay for anchors to render
  yield delay(PERMALINK_DELAY);
  yield put(scrollTo({ targetId: permalink }));
}

export function* scrollBasedOnPermalinkType(permalink: string) {
  if (LINE_PERMALINK_MATCHER.test(permalink)) {
    yield call(scrollToLine);
  } else if (COMMENT_PERMALINK_MATCHER.test(permalink)) {
    yield call(scrollToComment);
  } else if (FILEPATH_PERMALINK_MATCHER.test(permalink)) {
    yield call(scrollToFilepath);
  } else {
    yield call(scrollToGenericPermalink);
  }
}

export function* commentPermalinkScrollerSaga() {
  while (true) {
    yield all([
      take(INITIAL_DIFFS_RENDERED),
      take(FETCH_COMMENTS.SUCCESS),
      take(FETCH_DIFF.SUCCESS),
      take(LOAD_DIFFSTAT.SUCCESS),
    ]);
    yield fork(scrollToComment);
  }
}

export function* permalinkClickedScrollerSaga() {
  while (true) {
    const { payload: activePermalink } = yield take(ACTIVE_DIFF_PERMALINK);
    yield put(
      scrollTo({
        targetId: activePermalink,
        customBehavior: scrollPastStickyHeaders(activePermalink),
      })
    );
    const isDiffStatEscapedFilePathsEnabled = yield select(
      getIsDiffStatEscapedFilePathsEnabled
    );
    updateHashInURL(activePermalink, isDiffStatEscapedFilePathsEnabled);
  }
}

export function* permalinkChangedScrollerSaga() {
  while (true) {
    const { payload: permalink } = yield take(PERMALINK_HASH_CHANGE);

    yield call(scrollBasedOnPermalinkType, permalink);
  }
}

// @ts-ignore TODO: fix noImplicitAny error here
export function* fileScrollerSaga(action) {
  const { payload: targetId } = action;
  const isSingleFileModeActive = yield select(getIsSingleFileModeActive);
  if (isSingleFileModeActive) {
    // When in single file mode, clicking a new file in the file tree should cause
    // the page to scroll to the top of the new file. Since scrolling requres the
    // correct filepath-based anchor element to be rendered on the page, we need to
    // wait for the diff to render before starting scrolling.
    yield take(DIFFS_HAVE_RENDERED);
  }
  yield put(scrollTo({ targetId }));

  const isDiffStatEscapedFilePathsEnabled = yield select(
    getIsDiffStatEscapedFilePathsEnabled
  );
  updateHashInURL(targetId, isDiffStatEscapedFilePathsEnabled);
}

// @ts-ignore TODO: fix noImplicitAny error here
export function* activeFileCollapsedScrollerSaga(action) {
  const activeDiff = yield select(getActiveDiff);
  const { payload } = action;
  const filePath = payload.filepath;
  const targetId = getFilepathAnchorId(filePath);
  if (activeDiff === targetId) {
    yield put(scrollTo({ targetId }));
  }
}

export function* commentsDialogScrollerSaga() {
  while (true) {
    yield all([
      take(SCROLL_TO_COMMENT_IN_MODAL),
      take(FETCH_OUTDATED_COMMENT_CONTEXT.SUCCESS),
    ]);

    const targetId = getPermalink() || '';
    yield delay(PERMALINK_DELAY);
    yield put(
      scrollTo({
        targetId,
        customBehavior: 'instant',
      })
    );
  }
}
