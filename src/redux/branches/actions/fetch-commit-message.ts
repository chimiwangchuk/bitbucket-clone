import { createAsyncAction } from 'src/redux/actions';
import { MergeStrategy } from 'src/types/pull-request';

import { prefixed } from './common';

export type FetchDefaultCommitMessageOptions = {
  sourceBranchName: string;
  destinationBranchName: string;
  mergeStrategy: MergeStrategy;
};

export type FetchDefaultCommitMessageAction = {
  type: string;
  payload: FetchDefaultCommitMessageOptions;
};

export const FETCH_DEFAULT_COMMIT_MESSAGE = createAsyncAction(
  prefixed('FETCH_DEFAULT_COMMIT_MESSAGE')
);
export const fetchDefaultCommitMessage = (
  payload: FetchDefaultCommitMessageOptions
): FetchDefaultCommitMessageAction => ({
  type: FETCH_DEFAULT_COMMIT_MESSAGE.REQUEST,
  payload,
});
