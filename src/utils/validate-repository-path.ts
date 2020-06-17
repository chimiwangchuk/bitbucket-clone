// To be safe we are capturing anything as slugs. At a minimum, it
// should match the to_slug function in bitbucket core.
// https://staging.bb-inf.net/bitbucket/bitbucket/src/5fced6/apps/common/util.py#util.py-173:221
export const REPO_FULL_SLUG_REGEX = ':repositoryFullSlug([^/]+/[^/]+)';
