import { ChunkEntry } from '@atlassian/bitkit-diff';
import { Diff } from 'src/types/pull-request';

function amendChunk(chunk: ChunkEntry, index: number) {
  const isFirstChunk = index === 0;
  const { changes } = chunk;
  const extra = {
    isLoading: false,
    before: {
      hasMoreLines: true,
    },
    after: {
      hasMoreLines: true,
    },
  };

  if (isFirstChunk) {
    const firstChange = changes[0];
    const isLineOne = firstChange.oldLine === 1 || firstChange.newLine === 1;
    extra.before.hasMoreLines = !isLineOne;
  }

  return {
    ...chunk,
    id: chunk.content,
    extra,
  };
}

export function amendChunks(diffs: Diff[]): Diff[] {
  return diffs.map(diff => ({
    ...diff,
    chunks: diff.chunks.map(amendChunk),
  }));
}

function clearContextExpansion(chunk: ChunkEntry) {
  return {
    ...chunk,
    extra: {
      ...chunk.extra,
      after: { hasMoreLines: false },
      before: { hasMoreLines: false },
    },
  };
}

export function clearContextExpansions(diffs: Diff[]): Diff[] {
  return diffs.map(diff => ({
    ...diff,
    chunks: diff.chunks.map(clearContextExpansion),
  }));
}
