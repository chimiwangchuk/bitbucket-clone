import createReducer from 'src/utils/create-reducer';
import { DetailedBranch } from 'src/sections/repository/sections/branches/types';
import { DELETE_BRANCH_DIALOG, DELETE_BRANCH } from '../actions';

export type DeleteBranchErrorType =
  | 'ACCESS_DENIED'
  | 'BRANCH_NOT_FOUND'
  | 'GENERIC';

export const DeleteBranchErrorTypes = {
  ACCESS_DENIED: 'ACCESS_DENIED',
  BRANCH_NOT_FOUND: 'BRANCH_NOT_FOUND',
  GENERIC: 'GENERIC',
};

type DeleteBranchSuccessFlagState = {
  branch: DetailedBranch | null | undefined;
};

type DeleteBranchErrorFlagState = {
  branch: DetailedBranch | null | undefined;
  errorType: DeleteBranchErrorType | null | undefined;
};

export type DeleteBranchDialogState = {
  branch: DetailedBranch | null | undefined;
  isOpen: boolean;
  isDeleting: boolean;
  successFlag: DeleteBranchSuccessFlagState;
  errorFlag: DeleteBranchErrorFlagState;
};

export const initialState: DeleteBranchDialogState = {
  branch: null,
  isOpen: false,
  isDeleting: false,
  successFlag: {
    branch: null,
  },
  errorFlag: {
    branch: null,
    errorType: null,
  },
};

export default createReducer(initialState, {
  [DELETE_BRANCH_DIALOG.OPEN](state, action) {
    const { branch } = action.payload;
    return {
      ...state,
      branch,
      isOpen: true,
    };
  },
  [DELETE_BRANCH_DIALOG.CLOSE](state) {
    return {
      ...state,
      isOpen: false,
      branch: null,
    };
  },
  [DELETE_BRANCH.REQUEST](state) {
    return {
      ...state,
      isDeleting: true,
    };
  },
  [DELETE_BRANCH.SUCCESS](state, action) {
    const branch = action.payload;
    return {
      ...state,
      isOpen: false,
      isDeleting: false,
      successFlag: {
        ...state.successFlag,
        branch,
      },
    };
  },
  [DELETE_BRANCH.ERROR](state, action) {
    const { branch, errorType } = action.payload;
    return {
      ...state,
      isOpen: false,
      isDeleting: false,
      errorFlag: {
        ...state.errorFlag,
        branch,
        errorType,
      },
    };
  },
});
