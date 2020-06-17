import { PRLocator } from 'src/types/pull-request';

export type RouteParams = {
  repositoryOwner: string;
  repositorySlug: string;
  pullRequestId: string;
};

const cleanSlug = (slug: string | undefined) =>
  (slug || '').replace(/\.git$/, '');

export function areLocatorsEqual(a: PRLocator, b: PRLocator) {
  // Users can enter the UUID of an owner into the url bar
  const isOwner =
    a.owner === b.owner || a.ownerUuid === b.owner || a.owner === b.ownerUuid;

  // Users can enter the repo-slug, the UUID, or the repo-slug.git
  const isRepo =
    cleanSlug(a.slug) === cleanSlug(b.slug) ||
    // if repoUuid is present we have data from state which is more complete
    a.repoUuid === b.slug ||
    b.repoUuid === a.slug;
  return isOwner && a.id === b.id && isRepo;
}

export function toPullRequestLocator(routeParams: RouteParams) {
  return {
    owner: routeParams.repositoryOwner,
    slug: routeParams.repositorySlug,
    id: parseInt(routeParams.pullRequestId, 10),
  };
}
