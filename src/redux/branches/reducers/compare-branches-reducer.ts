import createReducer from 'src/utils/create-reducer';
import {
  COMPARE_BRANCHES_DIALOG,
  COMPARE_BRANCHES,
  FETCH_DEFAULT_COMMIT_MESSAGE,
  COMPARE_BRANCHES_POLL_STATUS,
} from '../actions';

export type CompareBranchesDialogState = {
  isOpen: boolean;
  sourceBranchName: string | null;
  destinationBranchName: string | null;
  sourceRepositoryFullName: string | null;
  destinationRepositoryFullName: string | null;
  defaultCommitMessage: string;
  isLoading: boolean;
  isMerge: boolean;
  errorMessage: string | null;
  reloadAction: { type: string } | null;
};

export const initialState: CompareBranchesDialogState = {
  isOpen: false,
  sourceBranchName: null,
  destinationBranchName: null,
  sourceRepositoryFullName: null,
  destinationRepositoryFullName: null,
  defaultCommitMessage: '',
  isLoading: false,
  isMerge: false,
  errorMessage: null,
  reloadAction: null,
};

export default createReducer(initialState, {
  [COMPARE_BRANCHES_DIALOG.OPEN](_, action) {
    const {
      sourceBranchName,
      destinationBranchName,
      sourceRepositoryFullName,
      destinationRepositoryFullName,
      isMerge,
      reloadAction,
    } = action.payload;
    return {
      isOpen: true,
      defaultCommitMessage: '',
      isLoading: false,
      sourceBranchName,
      destinationBranchName,
      sourceRepositoryFullName,
      destinationRepositoryFullName,
      isMerge,
      errorMessage: null,
      reloadAction,
    };
  },
  [COMPARE_BRANCHES.REQUEST](state) {
    return {
      ...state,
      isLoading: true,
    };
  },
  [COMPARE_BRANCHES_POLL_STATUS.ERROR](state, action) {
    return {
      ...state,
      errorMessage: action.payload,
    };
  },
  [FETCH_DEFAULT_COMMIT_MESSAGE.REQUEST](state) {
    return {
      ...state,
      defaultCommitMessage: '',
    };
  },
  [FETCH_DEFAULT_COMMIT_MESSAGE.SUCCESS](state, action) {
    return {
      ...state,
      defaultCommitMessage: action.payload,
    };
  },
  [COMPARE_BRANCHES_DIALOG.CLOSE](state) {
    return {
      ...state,
      isOpen: false,
    };
  },
});
