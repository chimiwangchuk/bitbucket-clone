import { get } from 'lodash-es';
import { TreeEntry, FileEntry, DirectoryEntry } from 'src/components/file-tree';
import { AnnotatedDiffStat, DiffStatStatus } from 'src/types/diffstat';
import { getFileHref } from './get-file-href';

const buildFile = (
  name: string,
  fullPath: string | null | undefined,
  status: DiffStatStatus,
  isConflicted: boolean | null | undefined,
  comments: number | null | undefined,
  linesAdded: number,
  linesRemoved: number
): FileEntry => ({
  name,
  href: `#${getFileHref(fullPath || '')}`,
  type: 'file',
  fileDiffStatus: status,
  isConflicted: !!isConflicted,
  comments: comments || 0,
  linesAdded,
  linesRemoved,
});

const buildDirectory = (
  name: string,
  contents: TreeEntry[]
): DirectoryEntry => ({
  name,
  type: 'directory',
  contents,
});

/**
 * Converts a single diff stat api entry into a nested
 * directory->directory->file structure that the file-tree expects
 */
export const transformSingleDiffStat = (
  diffStat: AnnotatedDiffStat,
  remainingPath: string,
  fullPath?: string
) => {
  const segments = remainingPath.split('/');
  const fileSegment = segments.pop()!; // Non-nullable as long as remainingPath is non-null
  const file = buildFile(
    fileSegment,
    fullPath || remainingPath,
    diffStat.status,
    diffStat.isConflicted,
    diffStat.comments,
    diffStat.lines_added,
    diffStat.lines_removed
  );

  const result = segments.reduceRight(
    (prev: TreeEntry, current: string) => buildDirectory(current, [prev]),
    file
  );

  return result;
};

const directoryByName = (name: string) => (entry: TreeEntry): boolean =>
  entry.name === name && entry.type === 'directory';

type FindRootResult = {
  root: TreeEntry[];
  remainingPath: string;
};

/**
 * Traverses an existing file tree entries list to find where a new diffstat file should be placed.
 * If the new entry's folder doesn't exist then the entry is attached at the root.
 * New entries that share a folder with earlier entries will be placed in the same folder.
 */
const findPlaceInTree = (
  entries: TreeEntry[],
  path: string
): FindRootResult => {
  let directoryLevelRef: TreeEntry[] = entries;
  const pathSegments = path.split('/');

  let pathSegment = pathSegments[0];
  let matchedDirectory: TreeEntry | null | undefined = directoryLevelRef.find(
    directoryByName(pathSegment)
  );
  if (matchedDirectory && matchedDirectory.type === 'directory') {
    directoryLevelRef = matchedDirectory.contents;
  }

  while (pathSegments.length > 1 && matchedDirectory) {
    pathSegments.shift();
    [pathSegment] = pathSegments;
    matchedDirectory = directoryLevelRef.find(directoryByName(pathSegment));
    if (matchedDirectory && matchedDirectory.type === 'directory') {
      directoryLevelRef = matchedDirectory.contents;
    }
  }

  return {
    root: directoryLevelRef,
    remainingPath: pathSegments.join('/'),
  };
};

export const diffStatToFileTree = (
  diffStats: AnnotatedDiffStat[]
): TreeEntry[] => {
  // @ts-ignore TODO: fix noImplicitAny error here
  const entries = [];

  diffStats.forEach(stat => {
    const displayedPath = get(stat, 'new.path') || get(stat, 'old.path', '');
    // @ts-ignore TODO: fix noImplicitAny error here
    const { root, remainingPath } = findPlaceInTree(entries, displayedPath);
    root.push(transformSingleDiffStat(stat, remainingPath, displayedPath));
  });

  // @ts-ignore TODO: fix noImplicitAny error here
  return entries;
};
