import { ChunkEntry } from '@atlassian/bitkit-diff';
import { ContextLine } from '../sagas/utils/convert-to-chunks-format';
import { prependToChunk } from './prepend-to-chunk';
import { appendToChunk } from './append-to-chunk';

export function mergeContextLinesWithChunks(
  chunks: ChunkEntry[],
  chunkId: string,
  contextLines: ContextLine[],
  beforeOrAfter: 'before' | 'after',
  hasMoreLines: boolean
) {
  const chunkIndex = chunks.findIndex(chunk => chunk.id === chunkId);

  if (beforeOrAfter === 'before') {
    return prependToChunk(chunks, chunkIndex, contextLines, hasMoreLines);
  }

  return appendToChunk(chunks, chunkIndex, contextLines, hasMoreLines);
}
