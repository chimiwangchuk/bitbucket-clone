import {
  ChangeReducerAccumulator,
  ChunkEntry,
  ChunkReducerAccumulator,
  Line,
} from '../types';

const EMPTY_LINE: Line = {
  type: 'empty',
  content: '',
};

export function fillGaps(acc: ChangeReducerAccumulator): void {
  const beforeLength = acc.before.length;
  const afterLength = acc.after.length;

  const delta = Math.abs(beforeLength - afterLength);
  const fillArray = new Array(delta);

  for (let i = 0; i < delta; i += 1) {
    fillArray[i] = EMPTY_LINE;
  }

  if (beforeLength >= afterLength) {
    acc.after.push(...fillArray);
  } else {
    acc.before.push(...fillArray);
  }
}

export function reduceChanges(
  acc: ChangeReducerAccumulator,
  change: Line
): ChangeReducerAccumulator {
  switch (change.type) {
    case 'del':
      acc.before.push(change);
      break;
    case 'add':
      acc.after.push(change);
      break;
    default:
      fillGaps(acc);

      acc.before.push(change);
      acc.after.push(change);
  }

  return acc;
}

export function splitChanges(changes: Line[]) {
  const acc = changes.reduce(reduceChanges, { before: [], after: [] });
  fillGaps(acc);
  return acc;
}

export default function groupChunk(chunk: ChunkEntry): ChunkReducerAccumulator {
  const { changes } = chunk;
  const acc = splitChanges(changes);

  return {
    before: { ...chunk, changes: acc.before },
    after: { ...chunk, changes: acc.after },
  };
}
