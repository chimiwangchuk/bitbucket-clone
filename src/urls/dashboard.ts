import { stringify } from './utils';

type QueryParams = {
  pagelen?: number;
  page?: number;
  q?: string | null;
  watching?: boolean | null;
  sort?: string | null;
};

type ProjectQueryParams = {
  pagelen?: number;
  fields?: string;
  q?: string | null;
};

export default {
  api: {
    internal: {
      dashboardRepositories: (queryParams?: QueryParams) => {
        const url = `/!api/internal/dashboard/repositories`;
        return `${url}${stringify(queryParams || {})}`;
      },

      repositoryOwners: (query: string) => {
        const url = `/!api/internal/dashboard/repository-owners`;
        return `${url}${stringify({ query })}`;
      },

      repositoryBuildStatuses: () => {
        return `/!api/internal/repository-statuses`;
      },

      repositoryProjects: (queryParams?: ProjectQueryParams) => {
        const url = `/!api/internal/dashboard/repository-projects`;
        return `${url}${stringify(queryParams || {})}`;
      },
    },
    v20: {
      profileRepositories: (uuid: string, queryParams?: QueryParams) => {
        const url = `/!api/2.0/repositories/${uuid}`;
        return `${url}${stringify(queryParams || {})}`;
      },
      filterUserWorkspaces: (search?: string) => {
        const url = '/!api/2.0/workspaces';
        const query = { q: `name~"${search}"` };
        return `${url}${search ? stringify(query) : null}`;
      },
    },
  },
  ui: {
    root: () => '/',
    overview: () => '/dashboard/overview',
    repositories: (search?: string) => {
      const url = `/dashboard/repositories`;
      return `${url}${stringify({ search })}`;
    },
  },
};
