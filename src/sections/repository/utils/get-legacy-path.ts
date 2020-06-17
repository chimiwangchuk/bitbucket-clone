// passes `repositoryOwner` and `repositorySlug` params and returns path

export const legacyPath = (path: string) =>
  `/:repositoryOwner/:repositorySlug/${path}`;
