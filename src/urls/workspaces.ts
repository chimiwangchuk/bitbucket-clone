const urls = {
  api: {
    internal: {
      create: `/!api/internal/workspaces/`,
    },
    v20: {
      get: (uuid?: string) => `/!api/2.0/workspaces${uuid ? `/${uuid}` : ''}`,
    },
  },
};

export default urls;
