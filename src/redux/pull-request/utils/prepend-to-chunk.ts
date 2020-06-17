// NOTE: This assumes there are existing context lines.  If the existing
// chunk lines are only diff lines, this WILL BREAK.

import { ChunkEntry } from '@atlassian/bitkit-diff';
import { ContextLine } from '../sagas/utils/convert-to-chunks-format';
import { getContentString } from './get-content-string';

export function prependToChunk(
  chunks: ChunkEntry[],
  chunkIndex: number,
  contextLines: ContextLine[],
  hasMoreLines: boolean
) {
  const oldChunk = chunks[chunkIndex];
  const newChunks = [...chunks];
  const newChunk = { ...oldChunk };

  newChunk.changes = [...contextLines, ...oldChunk.changes];

  newChunk.oldStart -= contextLines.length;
  newChunk.newStart -= contextLines.length;
  newChunk.oldLines += contextLines.length;
  newChunk.newLines += contextLines.length;

  newChunk.content = getContentString(newChunk);
  newChunk.extra.before.hasMoreLines = hasMoreLines;

  if (newChunk.oldStart === 1) {
    newChunk.extra.before.hasMoreLines = false;
  }

  newChunks[chunkIndex] = newChunk;
  return newChunks;
}
