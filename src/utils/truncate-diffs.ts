import {
  EXCESSIVE_DIFF_LINE_COUNT,
  SINGLE_FILE_MODE_EXCESSIVE_DIFF_LINE_COUNT,
} from 'src/constants/diffs';
import { Diff } from 'src/types/pull-request';
import { countAddedAndDeletedLines } from 'src/utils/count-diff-lines';
import {
  isBinaryDiff,
  isEmptyDiff,
  isExcessiveSizeDiff,
  isFileRenamedDiff,
  isImageDiff,
} from 'src/utils/diff-classifications';
import { getExcludedPattern } from 'src/utils/get-excluded-pattern';

type DiffRenderingFlags = {
  skipExcessiveDiffs: boolean;
  isSingleFileModeActive: boolean;
};

const hasRenderableLines = (diff: Diff, flags: DiffRenderingFlags) =>
  !diff.isFileContentsUnchanged &&
  !isImageDiff(diff) &&
  !isBinaryDiff(diff) &&
  !getExcludedPattern(diff) &&
  !isFileRenamedDiff(diff) &&
  !isEmptyDiff(diff) &&
  (!flags.skipExcessiveDiffs ||
    flags.isSingleFileModeActive ||
    !isExcessiveSizeDiff(diff));

export const truncateDiffsByOverallLineCount = (
  diffs: Diff[],
  flags: DiffRenderingFlags
) => {
  let lines = 0;
  let i = 0;

  for (; i < diffs.length; i++) {
    const file = diffs[i];
    const newLines = hasRenderableLines(file, flags)
      ? countAddedAndDeletedLines(file)
      : 0;
    lines += newLines;
    if (
      lines >
      (flags.isSingleFileModeActive
        ? SINGLE_FILE_MODE_EXCESSIVE_DIFF_LINE_COUNT
        : EXCESSIVE_DIFF_LINE_COUNT)
    ) {
      break;
    }
  }

  return diffs.slice(0, i);
};
