import { DiffStat } from 'src/types/diffstat';
import { Diff } from 'src/types/pull-request';

export enum DiffStatPathType {
  Escaped,
  Unescaped,
}

export const getDiffStatPath = (diffStat: DiffStat, type: DiffStatPathType) => {
  if (type === DiffStatPathType.Escaped) {
    return diffStat.new?.escaped_path || diffStat.old?.escaped_path || '';
  } else {
    return diffStat.new?.path || diffStat.old?.path || '';
  }
};

export const getDiffPath = (diff: Diff) =>
  diff && diff.to !== '/dev/null' ? diff.to : diff.from;
