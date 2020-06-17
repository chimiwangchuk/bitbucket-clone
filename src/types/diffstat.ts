export const isDiffStat = (diff: any): diff is DiffStat => {
  return 'type' in diff && diff.type === 'diffstat';
};

export type DiffStatCommitFile = {
  path: string | null | undefined;
  // COREX-2109 Make this non-optional
  escaped_path?: string;
  type: string;
  links: {
    self: {
      href: string;
    };
  };
};

// Most recently defined https://bitbucket.org/atlassian/orochi/src/master/orochi/base.py
export enum DiffStatStatus {
  Added = 'added',
  Removed = 'removed',
  Modified = 'modified',
  TypeChanged = 'type changed',
  Renamed = 'renamed',
  BinaryConflict = 'binary conflict',
  RemoteDeleted = 'remote deleted',
  LocalDeleted = 'local deleted',
  MergeConflict = 'merge conflict',
  FlagsConflict = 'flags conflict',
  ModeConflict = 'mode conflict',
  TypeConflict = 'type conflict',
  SymlinkConflict = 'symlink conflict',
  DirectoryFileConflict = 'directory/file conflict',
  FileDirectoryConflict = 'file/directory conflict',
  AddRenameConflict = 'add/rename conflict',
  RenameAddConflict = 'rename/add conflict',
  DeleteRenameConflict = 'delete/rename conflict',
  RenameDeleteConflict = 'rename/delete conflict',
  RenameConflict = 'rename conflict',
  SuprepoConflict = 'subrepo conflict',
}

export type DiffStat = {
  lines_added: number;
  lines_removed: number;
  new: DiffStatCommitFile | null | undefined;
  old: DiffStatCommitFile | null | undefined;
  status: DiffStatStatus;
  type: 'diffstat';
};

export type AnnotatedDiffStat = DiffStat & {
  isConflicted?: boolean;
  comments?: number;
};
