const urls = {
  api: {
    internal: {
      toggleFeature: (owner: string, feature: string) =>
        `/!api/internal/account/${owner}/features/${feature}`,
      contentPreview: () => `/!api/internal/content-preview/`,
    },
    v10: {},
    v20: {},
  },
  external: {
    fileRenderingLimitDocs:
      'https://confluence.atlassian.com/display/BITBUCKET/Limits+for+viewing+content+and+diffs',
    socialAuthLink: '/socialauth/login/atlassianid/',
    codeInsightsLearnMore:
      'https://confluence.atlassian.com/display/BITBUCKET/Code+insights',
  },
  ui: {
    addonDirectory: '/account/admin/addon-directory/',
    adminPlans: '/account/admin/plans/',
    branch: (owner: string, slug: string, branchName: string) =>
      `/${owner}/${slug}/branch/${branchName}`,
    fullCommit: (
      repositoryFullSlug: string,
      commitHash: string,
      path: string
    ) => `/${repositoryFullSlug}/full-commit/${commitHash}/${path}`,
    project: (owner: string, key: string) =>
      `/account/user/${owner}/projects/${key}`,
    accountPlansAndBilling: (uuid: string) =>
      `/account/user/${uuid}/plans-and-billing/`,
    workspacePlansAndBilling: (slug: string) =>
      `/${slug}/workspace/settings/plans-and-billing/`,
    repositoryMentions: (owner: string, slug: string, query: string) =>
      `/xhr/mentions/repositories/${owner}/${slug}?term=${query}`,
    pullRequest: (repositoryFullSlug: string, pullRequestId: number) =>
      `/${repositoryFullSlug}/pull-requests/${pullRequestId}`,
  },
};

export default urls;
