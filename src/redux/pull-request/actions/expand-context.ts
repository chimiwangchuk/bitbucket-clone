import { EXPAND_CONTEXT } from './constants';

export type ExpandContextParams = {
  filepath: string;
  fileIndex: number;
  expanderIndex: number;
  peekAheadOnly: boolean;
};

export type ExpandContextAction = {
  type: string;
  payload: ExpandContextParams;
};

const expandContext = (expandContextParams: ExpandContextParams) => ({
  type: EXPAND_CONTEXT.REQUEST,
  payload: expandContextParams,
});

export default expandContext;
