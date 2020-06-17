import { Diff } from 'src/types/pull-request';

export const countChunkLines = (file: Diff) =>
  file.chunks.reduce((prev, chunk) => prev + chunk.changes.length, 0);

export const countAddedAndDeletedLines = (diff: Diff) =>
  (diff.deletions || 0) + (diff.additions || 0);

export const countAllAddedAndDeletedLines = (diffs: Diff[]) =>
  diffs.reduce(
    (sum: number, diff: Diff) => sum + countAddedAndDeletedLines(diff),
    0
  );
