import { ChunkEntry } from '@atlassian/bitkit-diff';
import { ContextLine } from '../sagas/utils/convert-to-chunks-format';
import { chunksWillConnect } from './chunks-will-connect';
import { mergeChunks } from './merge-chunks';
import { simpleAppend } from './simple-append';

export function appendToChunk(
  chunks: ChunkEntry[],
  chunkIndex: number,
  contextLines: ContextLine[],
  hasMoreLines: boolean
) {
  if (chunksWillConnect(chunks, chunkIndex, contextLines)) {
    return mergeChunks(chunks, chunkIndex, contextLines);
  }

  return simpleAppend(chunks, chunkIndex, contextLines, hasMoreLines);
}
