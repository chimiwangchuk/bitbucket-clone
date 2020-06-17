// @ts-ignore TODO: fix noImplicitAny error here
import fuzz from 'fuzzaldrin-plus';
import { memoize } from 'lodash-es';

import { TreeDirectory } from '../types';

// @ts-ignore TODO: fix noImplicitAny error here
const filesFirst = (a, b) => {
  const isAFile = a.type === 'file';
  const isBFile = b.type === 'file';

  if (isAFile && !isBFile) {
    return -1;
  }
  if (isBFile && !isAFile) {
    return 1;
  }
  return 0;
};

const flattenTree = (directory: TreeDirectory, parent = '') => {
  let flat: any[] = [];
  directory.contents
    .slice()
    .sort(filesFirst)
    .forEach(content => {
      if (content.type === 'directory') {
        flat = flat.concat(flattenTree(content, `${parent}${content.name}/`));
      } else {
        flat.push({
          ...content,
          name: `${parent}${content.name}`,
        });
      }
    });
  return flat;
};

const memoTree = memoize(flattenTree);

/* Gets all files in the tree that match the given query
 *
 * This returns a flat array of files, and the file names are fully expanded
 * paths, e.g. "src/components/file.js"
 */
export const findFiles = (
  tree: TreeDirectory | null | undefined,
  query: string | null | undefined
) => {
  if (!tree || query === null || query === undefined) {
    return [];
  }

  const files = memoTree(tree);
  if (query === '') {
    return files;
  }
  return fuzz.filter(files, query, { key: 'name' });
};

const matchPart = (text: string, matches?: boolean) =>
  matches ? { text, match: true } : { text };

/* Gets all the parts of `path` that match `query`
 *
 * Given a path of "src/components/file.js" and a query of "comfi", this returns:
 *
 * ```
 * [{
 *   text: 'src/',
 * }, {
 *   text: 'com',
 *   match: true
 * }, {
 *   text: 'ponents/',
 * }, {
 *   text: 'fi',
 *   match: true
 * }, {
 *   text: 'le.js',
 * }]
 * ```
 *
 * This return structure is intended to be easy to iterate in a React component
 * to build a highlighted string.
 */
export const getMatchParts = (
  path: string,
  query: string | null | undefined
) => {
  if (!query) {
    return [matchPart(path)];
  }
  if (path === query) {
    return [matchPart(path, true)];
  }
  const matches = fuzz.match(path, query);
  if (!matches.length) {
    return [matchPart(path)];
  }

  // Stolen shamelessly from https://github.com/jeancroy/fuzz-aldrin-plus/blob/master/src/matcher.coffee#L42
  const slices: any[] = [];
  let strIdx = 0;
  let matchIdx = -1;

  while (++matchIdx < matches.length) {
    let match = matches[matchIdx];

    // Get text before the match position
    if (match > strIdx) {
      slices.push(matchPart(path.slice(strIdx, match)));
      strIdx = match;
    }

    // put consecutive matches together
    while (++matchIdx < matches.length) {
      if (matches[matchIdx] === match + 1) {
        match++;
      } else {
        matchIdx--;
        break;
      }
    }

    // Get matched text
    match++;
    slices.push(matchPart(path.slice(strIdx, match), true));
    strIdx = match;
  }

  // Get text after match position
  if (strIdx < path.length) {
    slices.push(matchPart(path.slice(strIdx)));
  }

  return slices;
};
