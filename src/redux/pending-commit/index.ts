import { CommitAction } from 'src/sections/repository/types';

// Action Types

const INITIATE_PENDING_COMMIT = 'source/INITIATE_PENDING_COMMIT';
const RESET_PENDING_COMMIT = 'source/RESET_PENDING_COMMIT';

type PendingCommitPayload = {
  action: CommitAction;
  fileContents?: string;
  filePath: string;
  newFilePath?: string;
};

type InitiatePendingCommitAction = {
  type: 'source/INITIATE_PENDING_COMMIT';
  payload: PendingCommitPayload;
};

type ResetPendingCommitAction = {
  type: 'source/RESET_PENDING_COMMIT';
};

type PendingCommitAction =
  | InitiatePendingCommitAction
  | ResetPendingCommitAction;

// Action Creators

const initiatePendingCommit = (payload: PendingCommitPayload) => ({
  type: INITIATE_PENDING_COMMIT,
  payload,
});

export const initiatePendingEdit = (options: {
  fileContents: string;
  filePath: string;
  newFilePath: string;
}) => initiatePendingCommit({ action: 'commit', ...options });

export const initiatePendingDelete = (filePath: string) =>
  initiatePendingCommit({ action: 'delete', filePath });

export const initiatePendingRename = (filePath: string, fileContents: string) =>
  initiatePendingCommit({ action: 'rename', fileContents, filePath });

export const resetPendingCommit = () => ({
  type: RESET_PENDING_COMMIT,
});

// Reducer

export type PendingCommitState = {
  action?: string;
  fileContents?: string;
  filePath?: string;
  newFilePath?: string;
};

const initialState: PendingCommitState = {
  action: undefined,
  fileContents: undefined,
  filePath: undefined,
  newFilePath: undefined,
};

export const reducer = (
  state: PendingCommitState = initialState,
  action: PendingCommitAction
): PendingCommitState => {
  switch (action.type) {
    case INITIATE_PENDING_COMMIT: {
      return {
        ...state,
        ...action.payload,
      };
    }

    case RESET_PENDING_COMMIT: {
      return { ...state, ...initialState };
    }

    default:
      return state;
  }
};
