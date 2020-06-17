const prefixed = (name: string) => `pullRequest/${name}`;

export type DiffStateMap = { [filepath: string]: boolean | undefined };

export const TOGGLE_DIFF_EXPANSION = prefixed('TOGGLE_DIFF_EXPANSION');
export const COLLAPSE_ALL_DIFFS = prefixed('COLLAPSE_ALL_DIFFS');
export const EXPAND_ALL_DIFFS = prefixed('EXPAND_ALL_DIFFS');
export const RESTORE_DIFFS_EXPAND_STATE = prefixed(
  'RESTORE_DIFFS_EXPAND_STATE'
);

export const TOGGLE_SIDE_BY_SIDE_MODE = prefixed('TOGGLE_SIDE_BY_SIDE_MODE');

export const toggleSideBySideMode = (options: {
  filePath?: string;
  isSideBySide: boolean;
}) => ({
  type: TOGGLE_SIDE_BY_SIDE_MODE,
  payload: options,
});
