import createReducer from 'src/utils/create-reducer';
import {
  BranchType,
  DetailedBranch,
  BranchingModelBranch,
} from 'src/sections/repository/sections/branches/types';
import {
  LOAD_BRANCHES,
  LOAD_BRANCHING_MODEL,
  LOAD_MAIN_BRANCH,
  UNLOAD_BRANCHES,
} from '../actions';

export type BranchingModelState = {
  branchTypes: BranchType[];
  development?: BranchingModelBranch | null;
  production?: BranchingModelBranch | null;
  isLoading: boolean;
};

export type MainBranchState = {
  branch: DetailedBranch | null;
  isLoading: boolean;
};

export type BranchListItemsState = {
  reloadUrl: string | null | undefined;
  branches: DetailedBranch[];
  isLoading: boolean;
  size: number;
  pageLength: number;
};

export type BranchListState = {
  branchingModel: BranchingModelState;
  mainBranch: MainBranchState;
  listItems: BranchListItemsState;
  isError: boolean;
};

export const initialState: BranchListState = {
  branchingModel: {
    branchTypes: [],
    production: null,
    development: null,
    isLoading: false,
  },
  mainBranch: {
    branch: null,
    isLoading: true,
  },
  listItems: {
    reloadUrl: null,
    size: 0,
    pageLength: 0,
    branches: [],
    isLoading: false,
  },
  isError: false,
};

export default createReducer(initialState, {
  [LOAD_MAIN_BRANCH.REQUEST](state) {
    return {
      ...state,
      mainBranch: {
        ...state.mainBranch,
        isLoading: true,
      },
    };
  },
  [LOAD_MAIN_BRANCH.SUCCESS](state, action) {
    const [branch] = action.payload.result.values;
    return {
      ...state,
      mainBranch: {
        ...state.mainBranch,
        isLoading: false,
        branch,
      },
    };
  },
  [LOAD_MAIN_BRANCH.ERROR](state) {
    return {
      ...state,
      isError: true,
      mainBranch: {
        ...state.mainBranch,
        isLoading: false,
      },
    };
  },
  [LOAD_BRANCHING_MODEL.REQUEST](state) {
    return {
      ...state,
      branchingModel: {
        ...state.branchingModel,
        branchTypes: [],
        production: null,
        development: null,
        isLoading: true,
      },
    };
  },
  [LOAD_BRANCHING_MODEL.SUCCESS](state, action) {
    const {
      branch_types: branchTypes,
      production,
      development,
    } = action.payload;
    const devBranch = development &&
      development.branch && {
        ...development.branch,
        use_mainbranch: development.use_mainbranch,
      };
    const prodBranch = production &&
      production.branch && {
        ...production.branch,
        use_mainbranch: production.use_mainbranch,
      };

    return {
      ...state,
      branchingModel: {
        ...state.branchingModel,
        branchTypes,
        development: devBranch || null,
        production: prodBranch || null,
        isLoading: false,
      },
    };
  },
  [LOAD_BRANCHING_MODEL.ERROR](state) {
    return {
      ...state,
      branchingModel: {
        ...state.branchingModel,
        branchTypes: [],
        production: null,
        development: null,
        isLoading: false,
      },
    };
  },
  [LOAD_BRANCHES.REQUEST](state, action) {
    const { url } = action.meta!;
    return {
      ...state,
      isError: false,
      listItems: {
        ...state.listItems,
        ...(url && { reloadUrl: url }),
        isLoading: true,
      },
    };
  },
  [LOAD_BRANCHES.SUCCESS](state, action) {
    const {
      values: branches,
      size,
      pagelen: pageLength,
    } = action.payload.result;

    return {
      ...state,
      listItems: {
        ...state.listItems,
        size,
        pageLength,
        branches,
        isLoading: false,
      },
    };
  },
  [LOAD_BRANCHES.ERROR](state) {
    return {
      ...state,
      isError: true,
      listItems: {
        ...state.listItems,
        isLoading: false,
      },
    };
  },
  [UNLOAD_BRANCHES]() {
    return initialState;
  },
});
