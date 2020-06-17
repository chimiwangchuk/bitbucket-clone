// NOTE: backend uses the terms 'above' and 'below' in terms of the visual line ordering

import { ChunkEntry } from '@atlassian/bitkit-diff';

function chunksWillConnect(chunks: ChunkEntry[], chunkIndex: number) {
  const NUM_LINES_FETCHED = 10;

  const isLastChunk = chunkIndex >= chunks.length - 1;
  if (isLastChunk) {
    return false;
  }

  const chunk = chunks[chunkIndex];
  const newChunkBottom = chunk.oldStart + chunk.oldLines + NUM_LINES_FETCHED;

  const nextChunk = chunks[chunkIndex + 1];
  const newNextChunkTop = nextChunk.oldStart - NUM_LINES_FETCHED;

  return newChunkBottom >= newNextChunkTop - 1;
}

function lineNumsBefore(chunk: ChunkEntry) {
  const endingFrom = chunk.oldStart ? chunk.oldStart : undefined;
  const endingTo = chunk.newStart ? chunk.newStart : undefined;

  return {
    endingFrom,
    endingTo,
  };
}

function lineNumsAfter(chunk: ChunkEntry) {
  const { changes } = chunk;
  const lastLine = changes[changes.length - 1];

  return {
    startingFrom: lastLine.oldLine,
    startingTo: lastLine.newLine,
  };
}

export function getContextData(chunks: ChunkEntry[], expanderIndex: number) {
  const isFirstExpander = expanderIndex === 0;
  const isLastExpander = expanderIndex === chunks.length;
  // TODO: any typing we can add here?
  const contextData: any[] = [];
  let willMergeChunks = false;
  let lineNums;

  // Intend to load extra context for chunk PRIOR the context
  // expander button that was clicked.
  if (!isFirstExpander) {
    const chunkIndex = expanderIndex - 1;
    const chunk = chunks[chunkIndex];

    if (chunksWillConnect(chunks, chunkIndex)) {
      const nextChunk = chunks[chunkIndex + 1];
      lineNums = {
        ...lineNumsAfter(chunk),
        ...lineNumsBefore(nextChunk),
      };
      willMergeChunks = true;
    } else {
      lineNums = lineNumsAfter(chunk);
    }

    contextData.push({
      beforeOrAfter: 'after',
      chunkId: chunk.id,
      lineNums,
      willMergeChunks,
    });
  }

  // Intend to load extra context for chunk POST the context
  // expander button that was clicked.
  if (!isLastExpander && !willMergeChunks) {
    const chunkIndex = expanderIndex;
    const chunk = chunks[chunkIndex];

    contextData.push({
      beforeOrAfter: 'before',
      chunkId: chunk.id,
      lineNums: lineNumsBefore(chunk),
    });
  }

  return contextData;
}
