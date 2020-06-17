export function getBranchesFullNames(
  sourceBranchName: string | null | undefined,
  destinationBranchName: string | null | undefined,
  sourceRepositoryFullName: string | null | undefined,
  destinationRepostioryFullName: string | null | undefined
) {
  if (!sourceBranchName || !destinationBranchName) {
    return {
      sourceBranchName: '',
      destinationBranchName: '',
    };
  }

  if (
    !sourceRepositoryFullName ||
    !destinationRepostioryFullName ||
    sourceRepositoryFullName === destinationRepostioryFullName
  ) {
    return {
      sourceBranchName,
      destinationBranchName,
    };
  }

  return {
    sourceBranchName: `${sourceRepositoryFullName}:${sourceBranchName}`,
    destinationBranchName: `${destinationRepostioryFullName}:${destinationBranchName}`,
  };
}
