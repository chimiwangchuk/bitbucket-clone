import { RepositoryFilters } from 'src/sections/dashboard/types';

export const buildRepositoryBBQL = (
  filter: RepositoryFilters | undefined
): string | null => {
  if (!filter) {
    return null;
  }

  const queries: string[] = [];

  if (filter.search) {
    queries.push(
      `(name ~ "${filter.search}" OR description ~ "${filter.search}")`
    );
  }

  if (filter.project) {
    queries.push(`(project.key = "${filter.project.key}")`);
    queries.push(`(project.owner.uuid = "${filter.project.owner}")`);
  }

  if (filter.owner) {
    queries.push(`owner.uuid = "${filter.owner}"`);
  }

  if (filter.workspace) {
    queries.push(`workspace.uuid = "${filter.workspace}"`);
  }

  if (filter.scm) {
    queries.push(`scm = "${filter.scm}"`);
  }

  return queries.join(' AND ');
};
