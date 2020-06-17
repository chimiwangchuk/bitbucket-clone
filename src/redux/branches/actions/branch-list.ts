import { stringify } from 'qs';

import { createAsyncAction, fetchAction } from 'src/redux/actions';
import urls from 'src/sections/repository/urls';
import { Sort } from 'src/sections/repository/sections/branches/types';
import { branch as branchSchema } from '../schemas';

import { prefixed } from './common';

export type LoadMainBranchOptions = {
  repositoryOwner: string;
  repositorySlug: string;
  name: string;
};

export type LoadBranchingModelOptions = {
  repositoryOwner: string;
  repositorySlug: string;
};

export type LoadBranchesOptions = {
  repositoryOwner: string;
  repositorySlug: string;
  sort: Sort;
  page: number;
  bbql: string;
  pagelen: number;
};

const queryFields = [
  '-values.target.author.user.account_id',
  '+values.pullrequest.state',
  '+values.pullrequest.created_on',
  '+values.pullrequests.state',
  '+values.pullrequests.created_on',
  '+values.pullrequests.closed_on',
  '-values.statuses',
  '+values.default_merge_strategy',
  '+values.merge_strategies',
].join(',');

export const LOAD_MAIN_BRANCH = createAsyncAction(prefixed('LOAD_MAIN_BRANCH'));
export const loadMainBranch = (options: LoadMainBranchOptions) => {
  const { repositoryOwner, repositorySlug, name } = options;

  const query = stringify({
    branch: name,
    fields: queryFields,
  });
  const url = `${urls.api.internal.branchList(
    repositoryOwner,
    repositorySlug
  )}?${query}`;

  const schema = { values: [branchSchema] };
  return fetchAction(LOAD_MAIN_BRANCH, { url, schema });
};

export const LOAD_BRANCHING_MODEL = createAsyncAction(
  prefixed('LOAD_BRANCHING_MODEL')
);
export const loadBranchingModel = (options: LoadBranchingModelOptions) => {
  const { repositoryOwner, repositorySlug } = options;

  const url = urls.api.v20.branchingModel(repositoryOwner, repositorySlug);

  return fetchAction(LOAD_BRANCHING_MODEL, { url, cache: { ttl: 0 } });
};

export const LOAD_BRANCHES = createAsyncAction(prefixed('LOAD_BRANCHES'));
export const loadBranches = (options: LoadBranchesOptions) => {
  const { repositoryOwner, repositorySlug } = options;

  const { sort, page, bbql, pagelen } = options;
  const query = stringify(
    {
      sort,
      page,
      q: bbql,
      pagelen,
      fields: queryFields,
    },
    { skipNulls: true }
  );

  const url = `${urls.api.internal.branchList(
    repositoryOwner,
    repositorySlug
  )}?${query}`;

  const schema = { values: [branchSchema] };
  return fetchAction(LOAD_BRANCHES, { url, schema });
};

export const RELOAD_BRANCHES = prefixed('RELOAD_BRANCHES');
export const reloadBranches = (url: string) => {
  const schema = { values: [branchSchema] };
  return fetchAction(LOAD_BRANCHES, { url, schema });
};

export const UNLOAD_BRANCHES = prefixed('UNLOAD_BRANCHES');
export const unloadBranches = () => ({
  type: UNLOAD_BRANCHES,
});
