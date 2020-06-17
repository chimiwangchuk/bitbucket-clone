import {
  EXCESSIVE_DIFF_FILE_SIZE_BYTES,
  EXCESSIVE_DIFF_FILE_SIZE_LINES,
} from 'src/constants/diffs';
import { Diff } from 'src/types/pull-request';
import {
  countAddedAndDeletedLines,
  countChunkLines,
} from 'src/utils/count-diff-lines';
import { getFileDiffSize } from 'src/utils/get-file-diff-size';

export const isBinaryDiff = (diff: Diff) => {
  return diff.isBinary && diff.fileDiffStatus !== 'type changed';
};

export const isEmptyDiff = (diff: Diff) => diff.chunks.length === 0;

export const isExcessiveSizeDiff = (diff: Diff) => {
  return (
    getFileDiffSize(diff) > EXCESSIVE_DIFF_FILE_SIZE_BYTES ||
    countAddedAndDeletedLines(diff) > EXCESSIVE_DIFF_FILE_SIZE_LINES
  );
};

// When viewing the entire file, we care about the total # of lines, not just the
// added/removed/changed lines
export const isExcessiveSizeEntireFile = (diff: Diff) => {
  return (
    getFileDiffSize(diff) > EXCESSIVE_DIFF_FILE_SIZE_BYTES ||
    countChunkLines(diff) > EXCESSIVE_DIFF_FILE_SIZE_LINES
  );
};

// We don't want to handle 'type changed' statuses in image diffs, so we let the default diff component (<DiffFile>)
// handle rendering a custom message for that. Renamed image diffs are handled by <FileContentsUnchangedDiff />
export const isImageDiff = (diff: Diff) => {
  return diff.isImage && diff.fileDiffStatus !== 'type changed';
};

export const isFileRenamedDiff = (diff: Diff) => {
  return diff.chunks.length === 0 && diff.fileDiffStatus === 'renamed';
};
