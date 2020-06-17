// NOTE: This assumes there are existing context lines.  If the existing
// chunk lines are only diff lines, this WILL BREAK.

import { ChunkEntry } from '@atlassian/bitkit-diff';
import { ContextLine } from '../sagas/utils/convert-to-chunks-format';

export function chunksWillConnect(
  chunks: ChunkEntry[],
  chunkIndex: number,
  contextLines: ContextLine[]
) {
  if (!contextLines.length) {
    return false;
  }

  const lastContextLine = contextLines[contextLines.length - 1];

  // Edge case: the api returns a diff line as last line.
  // Indicates that context lines have already bumped into next diff block.
  const isContextLine = lastContextLine.oldLine && lastContextLine.newLine;
  if (!isContextLine) {
    return true;
  }

  const contextLinesBottom = lastContextLine.oldLine;
  const nextChunk = chunks[chunkIndex + 1] || {};
  const nextChunkTop = nextChunk.oldStart;

  // @ts-ignore
  return contextLinesBottom >= nextChunkTop - 1;
}
