import { sortBy } from 'lodash-es';
import { ChunkEntry, Line } from '@atlassian/bitkit-diff';
import { getContentString } from './get-content-string';

/**
 * Intended to take a collection of chunks from a single file's diff
 * and sort them and merge any that touch or overlap with each other
 * resulting in the minimum amount of chunks necessary, and in order.
 * DISCLAIMER: This will fail for odd situations like chunks entirely
 * within other chunks. This works for our typical use-cases;
 *   fetching context around comments.
 *   expanding context around chunks.
 */
export function reconcileChunks(chunks: ChunkEntry[]) {
  const sortedChunks = sortBy(chunks, [chunk => chunk.oldStart]);

  const reconciledChunks = sortedChunks.reduce(
    (chunksSoFar: ChunkEntry[], currentChunk) => {
      if (chunksSoFar.length === 0) {
        return [currentChunk];
      }

      const prevChunk = chunksSoFar[chunksSoFar.length - 1];
      const chunksOverlap =
        prevChunk.newStart + prevChunk.newLines >= currentChunk.newStart ||
        prevChunk.oldStart + prevChunk.oldLines >= currentChunk.oldStart;

      if (!chunksOverlap) {
        return [...chunksSoFar, currentChunk];
      }

      // Merging current chunk into the previous
      const linesToKeep = currentChunk.changes.filter(line => {
        const isPastPrevChunksOldLines =
          !line.oldLine ||
          line.oldLine > prevChunk.oldStart + prevChunk.oldLines - 1;
        const isPastPrevChunksNewLines =
          !line.newLine ||
          line.newLine > prevChunk.newStart + prevChunk.newLines - 1;

        return isPastPrevChunksOldLines && isPastPrevChunksNewLines;
      });

      // Updating pieces of previous chunk to include new chunks stuff
      prevChunk.changes = [...prevChunk.changes, ...linesToKeep].sort(
        (a, b) => {
          if (a.oldLine && b.oldLine) {
            return a.oldLine - b.oldLine;
          }
          if (a.newLine && b.newLine) {
            return a.newLine - b.newLine;
          }
          // @ts-ignore there should always be either new or old line
          return (a.oldLine || a.newLine) - (b.oldLine || b.newLine);
        }
      );

      const firstOldLine: Line =
        prevChunk.changes.find(line => !!line.oldLine) || ({} as Line);
      prevChunk.oldStart = firstOldLine.oldLine || 0;
      prevChunk.oldLines += linesToKeep.filter(line => !!line.oldLine).length;

      prevChunk.newLines += linesToKeep.filter(line => !!line.newLine).length;
      const firstNewLine: Line =
        prevChunk.changes.find(line => !!line.newLine) || ({} as Line);
      prevChunk.newStart = firstNewLine.newLine || 0;
      prevChunk.content = getContentString(prevChunk);

      return chunksSoFar;
    },
    []
  );

  return reconciledChunks;
}
