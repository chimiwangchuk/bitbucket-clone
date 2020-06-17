import { flatMap, map, fromPairs } from 'lodash-es';

import { Commit } from 'src/components/types';

type Segment = {
  startColumn: number;
  endColumn: number;
  color: number;
};

export type CommitGraphElement = {
  color: number;
  column: number;
  hash: string;
  segments: Segment[];
};

const addNodes = (dest: string[], source: string[], pos: number): string[] =>
  new Array<string>().concat(
    dest.slice(0, pos),
    source,
    dest.slice(pos + 1, dest.length)
  );

// Similar to _.invert, but accepts a transform for the value
// (_.invertBy supports transforming the key)
// @ts-ignore TODO: fix noImplicitAny error here
const invertWith = (collection, valTransform = a => a) =>
  fromPairs(map(collection, (v, k) => [v, valTransform(k)]));

export default function buildGraph(commits: Commit[]): CommitGraphElement[] {
  let nextColor = 1;
  let columns: {
    [x: string]: number;
  } = {};
  const colors: {
    [x: string]: number;
  } = {};
  let seen: string[] = [];

  return commits.map(({ hash: commitHash, parents = [] }) => {
    if (!seen.includes(commitHash)) {
      columns[commitHash] = seen.length;
      colors[commitHash] = nextColor++;
      seen.push(commitHash);
    }

    const column = columns[commitHash];
    const color = colors[commitHash];
    delete colors[commitHash];

    const unseenParents = parents.reduce(
      (acc: string[], { hash: parentHash }) => {
        if (!seen.includes(parentHash)) {
          acc.push(parentHash);
        }

        return acc;
      },
      []
    );

    const next = addNodes(seen, unseenParents, column);
    columns = invertWith(next, parseInt);

    unseenParents.forEach((item, i) => {
      if (i === 0) {
        // First parent is the same color
        colors[item] = color;
      } else {
        colors[item] = nextColor++;
      }
    });

    const segments = flatMap<string, Segment>(seen, (seenHash, currColumn) => {
      if (next.includes(seenHash)) {
        return {
          startColumn: currColumn,
          endColumn: columns[seenHash],
          color: colors[seenHash],
        };
      }

      if (seenHash === commitHash) {
        return parents.map(({ hash: parentHash }) => ({
          startColumn: currColumn,
          endColumn: columns[parentHash],
          color: colors[parentHash],
        }));
      }

      return [];
    });

    seen = next;

    return { hash: commitHash, column, color, segments };
  });
}
