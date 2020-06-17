import { Team, User } from 'src/components/types';
import settings from 'src/settings';
import { stringify } from 'src/urls/utils';

type IssueFilterQueryParams = {
  pagelen?: number;
  page?: number;
  cloud_id: string;
  project_ids?: string[];
  statuses?: string[];
  assignees?: string[];
  text: string;
  sort?: string;
};

export default {
  ui: {
    root: (repositoryFullSlug: string) => `/${repositoryFullSlug}/jira/`,
    settingsJiraIntegration: (hasWorkspaceUi: boolean, workspace: string) =>
      hasWorkspaceUi
        ? `/${workspace}/workspace/settings/jira-integration`
        : `/account/user/${workspace}/jira-integration/`,
    workspace: (workspace: string) => `/${workspace}/`,
  },
  api: {
    v20: {
      workspacePermission: (workspace: string) =>
        `/!api/2.0/user/permissions/workspaces?fields=values.permission&q=workspace.slug="${workspace}"`,
    },
    internal: {
      availableProducts: () => '/!api/internal/my/available-products',

      sites: (owner: User | Team) =>
        `${settings.API_CANON_URL}/internal/${owner.type}s/${owner.uuid}/jira/sites`,
      connectedSites: (owner: User | Team) =>
        `${settings.API_CANON_URL}/internal/${owner.type}s/${owner.uuid}/jira/sites?connected=true`,
      relevantSites: (repositoryFullSlug: string) =>
        `${settings.API_CANON_URL}/internal/repositories/${repositoryFullSlug}/jira/sites`,
      project: (owner: User | Team, cloudId: string, projectId: string) =>
        `${settings.API_CANON_URL}/internal/${owner.type}s/${owner.uuid}/jira/sites/${cloudId}/projects/${projectId}`,
      projects: (owner: User | Team, cloudId: string, projectFilter?: string) =>
        `${settings.API_CANON_URL}/internal/${owner.type}s/${
          owner.uuid
        }/jira/sites/${cloudId}/projects${stringify({ projectFilter })}`,
      devActivity: (owner: User | Team, cloudId: string) =>
        `${settings.API_CANON_URL}/internal/${owner.type}s/${owner.uuid}/jira/sites/${cloudId}/issues/dev-status`,
      relevantProjects: (repositoryFullSlug: string) =>
        `${settings.API_CANON_URL}/internal/repositories/${repositoryFullSlug}/jira/projects`,
      relevantIssues: (
        repositoryFullSlug: string,
        filterParams: IssueFilterQueryParams
      ) =>
        `${
          settings.API_CANON_URL
        }/internal/repositories/${repositoryFullSlug}/jira/projects/issues${stringify(
          filterParams,
          {
            arrayFormat: 'repeat',
            filter: (_: string, value: any) => {
              if (value && value.length === 0) {
                return undefined;
              }
              return value;
            },
          }
        )}`,
      assignees: (repositoryFullSlug: string, cloudId: string) =>
        `${settings.API_CANON_URL}/internal/repositories/${repositoryFullSlug}/jira/projects/assignees?cloud_id=${cloudId}&pagelen=100`,
      issueCreationMetadata: (
        owner: User | Team,
        cloudId: string,
        projectId: string
      ) =>
        `${settings.API_CANON_URL}/internal/${owner.type}s/${owner.uuid}/jira/sites/${cloudId}/issuecreationmetadata?project_id=${projectId}`,

      issues: (repositoryFullSlug: string, pullRequestId: number | string) =>
        `${settings.API_CANON_URL}/internal/repositories/${repositoryFullSlug}/pullrequests/${pullRequestId}/jira/issues`,

      availableTransitions: (cloudId: string, issueKeyOrId: number | string) =>
        `${settings.API_CANON_URL}/internal/jira/sites/${cloudId}/issues/${issueKeyOrId}/transitions`,

      transitions: (repositoryFullSlug: string, pullRequestId: number) =>
        `${settings.API_CANON_URL}/internal/repositories/${repositoryFullSlug}/pullrequests/${pullRequestId}/jira/transitions`,

      myIssues: (cloudId: string, pagelen?: number) =>
        `${settings.API_CANON_URL}/internal/my/jira/sites/${cloudId}/issues${
          pagelen ? `?pagelen=${pagelen}` : ''
        }`,

      dashboardDevActivity: (cloudId: string) =>
        `${settings.API_CANON_URL}/internal/my/jira/sites/${cloudId}/issues/dev-status`,
    },
  },
  external: {
    wacTryJiraBbcBundleUrl:
      'https://www.atlassian.com/software/jira/bitbucket-integration?utm_source=bitbucket&utm_medium=in_product_ad&utm_campaign=bitbucket_jswtab&utm_content=jswtab_welcome',
    docsConnectJira: 'https://confluence.atlassian.com/x/FQCDM',
    docsUseJiraProjects: 'https://confluence.atlassian.com/x/JJ9gOg',
  },
};
