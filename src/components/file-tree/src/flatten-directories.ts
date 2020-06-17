import { TreeEntry, DirectoryEntry, FileEntry } from './types';

function isFile(entry: TreeEntry | null | undefined): entry is FileEntry {
  return !!entry && entry.type !== 'directory';
}

function isDirectory(
  entry: TreeEntry | null | undefined
): entry is DirectoryEntry {
  return !!entry && entry.type === 'directory';
}

export function flattenDirectories(treeEntry: TreeEntry): TreeEntry {
  if (isFile(treeEntry)) {
    return treeEntry;
  }

  let flattenedDirectory: DirectoryEntry = { ...treeEntry };

  // Flatten by absorbing the subdirectory into parent directory
  const subDirectory = treeEntry.contents[0];
  const hasOneSubDirectory = treeEntry.contents.length === 1;
  if (hasOneSubDirectory && isDirectory(subDirectory)) {
    flattenedDirectory.name += `/${subDirectory.name}`;
    flattenedDirectory.contents = subDirectory.contents;

    // Continue to flatten directories down the path
    const temp: any = flattenDirectories(flattenedDirectory);
    flattenedDirectory = temp;
  }

  // Done flattening this directory.  Now check it's current children.
  flattenedDirectory.contents = flattenedDirectory.contents.map(
    flattenDirectories
  );

  return flattenedDirectory;
}

export function flattenFiles(
  treeEntries: TreeEntry[],
  fileEntries: string[] = []
): string[] {
  if (treeEntries) {
    treeEntries.forEach(entry => {
      if (isFile(entry)) {
        fileEntries.push(entry.href);
      } else {
        flattenFiles(entry.contents, fileEntries);
      }
    });
  }
  return fileEntries;
}
