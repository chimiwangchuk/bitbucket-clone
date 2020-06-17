import { DetailedBranch } from 'src/sections/repository/sections/branches/types';
import { BranchingModelState } from './reducers/branch-list-reducer';

// Check if a branch should be allowed to delete in a bulk deletion scenario.
//
// Branches that are not allowed to delete are:
//   1. Main branch
//   2. Branches that are restricted to delete by permission rules
//   3. Production and development branches
//
// (Deleting the "production" and "development" branches are allowed if not
// restricted by branch permissions already. But we are not allowing it in a
// bulk deletion scenario to prevent those branches getting deleted accidentally.)
export const shouldAllowDelete = (
  branch: DetailedBranch,
  branchingModel: BranchingModelState
) => {
  const { isMainBranch, permissions } = branch;

  if (isMainBranch) {
    return false;
  } else if (permissions.delete !== 'allow') {
    return false;
  } else if (branch.name === branchingModel.production?.name) {
    return false;
  } else if (branch.name === branchingModel.development?.name) {
    return false;
  }

  return true;
};
