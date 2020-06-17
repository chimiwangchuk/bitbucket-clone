const urls = {
  api: {
    internal: {
      userPreference: (uuid: string, key: string) =>
        `/!api/internal/user/preferences/${uuid}/${key}/`,
      repositoriesLanguages: (workspaceSlug: string) =>
        `/!api/internal/repositories/${workspaceSlug}/languages`,
    },
    v10: {},
    v20: {
      team: (uuid: string) => `/!api/2.0/teams/${uuid}`,
      user: (uuid: string) => `/!api/2.0/users/${uuid}`,
    },
  },
  external: {},
  ui: {
    profile: (username: string) => `/${username}`,
    teams: (username: string) => `/${username}/profile/teams`,
  },
};

export default urls;
