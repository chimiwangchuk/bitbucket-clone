import qs from 'qs';

import escapeBbqlString from 'src/utils/escape-bbql-string';
import settings from 'src/settings';
import { RefType } from './types';

const urls = {
  api: {
    internal: {
      compare: (repositoryFullSlug: string) => `/${repositoryFullSlug}/compare`,
      details: (repositoryFullSlug: string) =>
        `/!api/internal/repositories/${repositoryFullSlug}/details`,
      onlineEditorCommit: (owner: string, slug: string) =>
        `/!api/internal/repositories/${owner}/${slug}/oecommits/`,
      toggleWatch: (repositoryFullSlug: string) =>
        `/${repositoryFullSlug}/follow`,
      branchList: (owner: string, slug: string) =>
        `/!api/internal/repositories/${owner}/${slug}/branch-list/`,
      pullRequestAuthors: (
        repositoryFullSlug: string,
        options: { status: string | null; query?: string }
      ) => {
        const url = `/!api/internal/repositories/${repositoryFullSlug}/pr-authors/`;
        if (options.query || options.status) {
          return `${url}?${qs.stringify(
            { pr_status: options.status, user_search: options.query },
            { skipNulls: true }
          )}`;
        }
        return url;
      },
      defaultCommitMsg: (
        repositoryFullSlug: string,
        mergeStrategy: string,
        sourceBranchName: string,
        destinationBranchName: string
      ) =>
        `/!api/internal/repositories/${repositoryFullSlug}/compare/default-commit-msg/${mergeStrategy}/${sourceBranchName}%0D${destinationBranchName}`,
      bulkDeleteBranches: (repositoryFullSlug: string) =>
        `/!api/internal/repositories/${repositoryFullSlug}/branches-delete`,
      repoSettingsDetails: (workspace: string, repoUuid: string) =>
        `/!api/internal/repositories/${workspace}/${repoUuid}/repo-settings-details`,
      repositoryAvatar: (workspace: string, repoUuid: string) =>
        `/${workspace}/${repoUuid}/admin/logo`,
    },
    v10: {},
    v20: {
      email: () => '/!api/2.0/user/emails',
      branches: (owner: string, slug: string) =>
        `${urls.api.v20.refs(owner, slug)}/branches`,
      branch: (owner: string, slug: string, branchName: string) =>
        `${urls.api.v20.refs(owner, slug)}/branches/${branchName}`,
      branchAbs: (owner: string, slug: string, branchName: string) =>
        `${settings.CANON_URL}${urls.api.v20.branch(owner, slug, branchName)}`,
      branchingModel: (owner: string, slug: string) =>
        `/!api/2.0/repositories/${owner}/${slug}/branching-model`,
      commits: (owner: string, slug: string) =>
        `${urls.api.v20.repository(owner, slug)}/commits`,
      forks: (owner: string, slug: string) =>
        `/!api/2.0/repositories/${owner}/${slug}/forks`,
      refs: (
        owner: string,
        slug: string,
        options?: { q?: string; sort?: string; pagelen?: number }
      ) => {
        const url = `${urls.api.v20.repository(owner, slug)}/refs`;
        if (options) {
          return `${url}?${qs.stringify(options, { skipNulls: true })}`;
        }
        return url;
      },
      findRefs: (owner: string, slug: string, name?: string) => {
        const REFS_PAGELEN = 25;

        if (!name) {
          return urls.api.v20.refs(owner, slug, { pagelen: REFS_PAGELEN });
        }
        const q = `name ~ "${escapeBbqlString(name)}"`;
        return urls.api.v20.refs(owner, slug, { q, pagelen: REFS_PAGELEN });
      },
      repositories: () => `/!api/2.0/repositories`,
      repository: (owner: string, slug: string) =>
        `/!api/2.0/repositories/${owner}/${slug}`,
      repositoryByUuid: (uuid: string) => urls.api.v20.repository('{}', uuid),
      repositoryAbs: (owner: string, slug: string) =>
        `${settings.CANON_URL}${urls.api.v20.repository(owner, slug)}`,
      tags: (owner: string, slug: string) =>
        `${urls.api.v20.refs(owner, slug)}/tags`,
      pullRequests: (owner: string, slug: string) =>
        `/!api/2.0/repositories/${owner}/${slug}/pullrequests/`,
      watchers: (owner: string, slug: string) =>
        `/!api/2.0/repositories/${owner}/${slug}/watchers`,
      deployKeys: (owner: string, slug: string) =>
        `/!api/2.0/repositories/${owner}/${slug}/deploy-keys/`,
      project: (owner: string, projectKey: string) =>
        `/!api/2.0/teams/${owner}/projects/${projectKey}`,
      projects: (owner: string, name: string) => {
        const url = `/!api/2.0/teams/${owner}/projects/`;
        if (name) {
          const q = `name ~ "${escapeBbqlString(name)}"`;
          return `${url}?${qs.stringify(
            { q, sort: 'name' },
            { skipNulls: true }
          )}`;
        }
        return url;
      },
    },
  },
  external: {
    emptyStateLearnMore: 'https://confluence.atlassian.com/x/Ep1IN',
    excludedFilesLearnMore: 'https://confluence.atlassian.com/x/j41LOQ',
    reduceRepositorySize: 'https://confluence.atlassian.com/x/xgMvEw',
    updateMirrorPushUrl: 'https://confluence.atlassian.com/x/jGP5MQ',
    referenceIssuesLearnMore: 'https://confluence.atlassian.com/x/JR9QLg',
    learnMoreAboutModifyingUrlsLink:
      'https://confluence.atlassian.com/x/hneeOQ#ChangeaworkspaceID-update_URLUpdatetheURLinyourconfigurationfile',
    bitbucketStatusPage: 'https://status.bitbucket.org',
  },
  ui: {
    admin: (owner: string, slug: string) =>
      `${urls.ui.repository(owner, slug)}/admin`,
    branches: (owner: string, slug: string) =>
      `${urls.ui.repository(owner, slug)}/branches`,
    branchPermissions: (owner: string, slug: string) =>
      `${urls.ui.repository(owner, slug)}/admin/branch-permissions`,
    commits: (
      repositoryName: string,
      opts?: { kind: RefType; refName: string } | null
    ) => {
      const url = `/${repositoryName}/commits`;
      if (!opts) {
        return url;
      }
      const kind = opts.kind === 'named_branch' ? 'branch' : opts.kind;
      return `${url}/${kind}/${opts.refName}`;
    },
    create: (params?: { owner?: string; project?: string }) => {
      if (params) {
        return `/repo/create?${qs.stringify(params, { skipNulls: true })}`;
      }
      return '/repo/create';
    },
    excludedFiles: (repositoryName: string) =>
      `/${repositoryName}/admin/pullrequests/excluded-files/`,
    fork: (owner: string, slug: string) =>
      `${urls.ui.repository(owner, slug)}/fork`,
    import: (params?: { owner?: string; project?: string }) => {
      if (params) {
        return `/repo/import?${qs.stringify(params, { skipNulls: true })}`;
      }
      return '/repo/import';
    },
    notifications: '/account/admin/notifications/',
    pipelines: (owner: string, slug: string) =>
      `${urls.ui.repository(
        owner,
        slug
      )}/addon/pipelines-installer/#!/?from=bitbucketBuildCard`,
    pullRequests: (owner: string, slug: string) =>
      `${urls.ui.repository(owner, slug)}/pull-requests`,
    pullRequestsTargetingBranch: (
      owner: string,
      slug: string,
      targetBranch: string
    ) =>
      `${urls.ui.repository(
        owner,
        slug
      )}/pull-requests?state=OPEN&at=${encodeURIComponent(targetBranch)}`,
    createPullRequest: (owner: string, slug: string, source?: string) => {
      const url = `${urls.ui.repository(owner, slug)}/pull-requests/new`;
      if (source) {
        return `${url}?${qs.stringify({ source })}`;
      }
      return url;
    },
    repository: (owner: string, slug: string) => `/${owner}/${slug}`,
    smartMirroring: (uuid: string) => `/account/user/${uuid}/mirroring/`,
    getHrefToLFS: (fullSlug: string) =>
      `/${fullSlug}/admin/lfs/file-management/`,
    getRepoDetailsUrl: (fullSlug: string) => `/${fullSlug}/admin`,
    transferRepo: (fullSlug: string) => `/${fullSlug}/admin/transfer`,
    deleteRepo: (fullSlug: string) => `/${fullSlug}/delete`,
  },
  xhr: {
    leaveRepository: (owner: string, slug: string) =>
      `/xhr/${owner}/${slug}/revoke/`,
    watchPrefs: (repositoryFullSlug: string) =>
      `/xhr/watch-prefs/${repositoryFullSlug}`,
  },
};

export default urls;
