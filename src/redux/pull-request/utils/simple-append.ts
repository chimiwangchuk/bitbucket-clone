// NOTE: This assumes there are existing context lines.  If the existing
// chunk lines are only diff lines, this WILL BREAK.

import { ChunkEntry } from '@atlassian/bitkit-diff';
import { ContextLine } from '../sagas/utils/convert-to-chunks-format';
import { getContentString } from './get-content-string';

export function simpleAppend(
  chunks: ChunkEntry[],
  chunkIndex: number,
  contextLines: ContextLine[],
  hasMoreLines: boolean
) {
  const oldChunk = chunks[chunkIndex];
  const newChunk = { ...oldChunk };
  const newChunks = [...chunks];

  newChunk.changes = [...oldChunk.changes, ...contextLines];
  newChunk.oldLines += contextLines.length;
  newChunk.newLines += contextLines.length;

  newChunk.content = getContentString(newChunk);
  newChunk.extra.after.hasMoreLines = hasMoreLines;

  newChunks[chunkIndex] = newChunk;
  return newChunks;
}
