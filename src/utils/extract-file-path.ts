import { Diff } from 'src/types/pull-request';
import { DiffStat, isDiffStat } from 'src/types/diffstat';

export type DiffPaths = { to: Diff['to']; from: Diff['from'] };

export const extractFilepath = (item: DiffStat | Diff | DiffPaths) => {
  if (isDiffStat(item)) {
    const path = item.new ? item.new.path : item.old ? item.old.path : '';
    return path || '';
  }
  // Here we know it's a Diff
  const { to, from } = item;
  return ['', '/dev/null', null, undefined].includes(to) ? from : to;
};

export function extractPrevFilepath(file: Diff) {
  return file.fileDiffStatus === 'renamed' ? file.from : undefined;
}
