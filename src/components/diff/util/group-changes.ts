import { GroupChangeAccumulator, Line } from '../types';

function changeReducer(
  acc: GroupChangeAccumulator,
  change: Line
): GroupChangeAccumulator {
  if (change.type === 'loaded' && acc.rest.length === 0) {
    acc.loadedBefore.push(change);
  } else if (change.type === 'loaded') {
    acc.loadedAfter.push(change);
  } else {
    acc.rest.push(change);
  }

  return acc;
}

export default function groupChanges(changes: Line[]): GroupChangeAccumulator {
  return changes.reduce(changeReducer, {
    loadedBefore: [],
    loadedAfter: [],
    rest: [],
  });
}
