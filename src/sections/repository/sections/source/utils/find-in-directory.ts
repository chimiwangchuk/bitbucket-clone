import { TreeDirectory, TreeEntry } from '../types';

/**
 * Given a directory entry returned from the Tree API, find an entry (file, directory, submodule, etc)
 * given a path or return `undefined` if not found
 *
 * Supports "partial" trees as well where directory entry names might themselves be paths
 */
export default function findInDirectory(
  directory: TreeDirectory,
  path: string | null | undefined
): TreeEntry | null | undefined {
  const adjustedPath = path ? `./${path}` : '.';
  const pathParts = adjustedPath.split('/');

  let pathToCheck: string[] = [];
  let treeEntry;

  while (pathParts.length) {
    if (treeEntry && treeEntry.type !== 'directory') {
      return undefined;
    }

    pathToCheck.push(pathParts.shift()!);
    const currentPath = pathToCheck.join('/');
    // @ts-ignore TODO: fix noImplicitAny error here
    const contents = treeEntry ? treeEntry.contents : [directory];

    // @ts-ignore TODO: fix noImplicitAny error here
    const [matchingEntry] = contents.filter(
      // @ts-ignore TODO: fix noImplicitAny error here
      entry => entry.name === currentPath
    );

    if (matchingEntry) {
      pathToCheck = [];
      treeEntry = matchingEntry;
    }
  }

  return pathToCheck.length ? undefined : treeEntry;
}
