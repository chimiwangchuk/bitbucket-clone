import { Diff } from 'src/types/pull-request';

export const defaultDiff: Diff = {
  from: '',
  to: '',
  headers: [],
  chunks: [],
  index: [],
  isBinary: false,
  isImage: false,
  deletions: 0,
  additions: 0,
};
