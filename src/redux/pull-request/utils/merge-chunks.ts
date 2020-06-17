// NOTE: This assumes there are existing context lines.  If the existing
// chunk lines are only diff lines, this WILL BREAK.

import { ChunkEntry } from '@atlassian/bitkit-diff';
import { ContextLine } from '../sagas/utils/convert-to-chunks-format';
import { getContentString } from './get-content-string';

export function mergeChunks(
  chunks: ChunkEntry[],
  chunkIndex: number,
  contextLines: ContextLine[]
) {
  const oldChunk = chunks[chunkIndex];
  const newChunks = [...chunks];
  const newChunk = { ...oldChunk };
  const nextChunk = chunks[chunkIndex + 1] || {};
  const nextChunkTop = nextChunk.oldStart;
  const chunkBottom = oldChunk.changes[oldChunk.changes.length - 1].oldLine;

  // Only chunks with existing context lines will be merged,
  // which means .oldLine and chunkBottom will always be defined.
  // @ts-ignore
  const trimmedLines = contextLines.slice(0, nextChunkTop - chunkBottom - 1);

  newChunk.changes = [
    ...oldChunk.changes,
    ...trimmedLines,
    ...nextChunk.changes,
  ];

  newChunk.oldLines += trimmedLines.length + nextChunk.oldLines;
  newChunk.newLines += trimmedLines.length + nextChunk.newLines;

  newChunk.content = getContentString(newChunk);
  newChunk.extra.after.hasMoreLines = nextChunk.extra.after.hasMoreLines;

  newChunks[chunkIndex] = newChunk;

  // delete next chunk
  newChunks.splice(chunkIndex + 1, 1);

  return newChunks;
}
