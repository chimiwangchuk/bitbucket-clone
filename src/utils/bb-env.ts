export enum BbEnv {
  Development = 'development',
  Production = 'production',
  Staging = 'staging',
}

export const getBbEnv = (): BbEnv => {
  const envMeta = document.querySelector('meta[name="bb-env"]');
  const env = envMeta ? envMeta.getAttribute('content') : null;

  return env as BbEnv;
};

export const getBbCommitHash = (): string => {
  const meta = document.querySelector('meta[name="bitbucket-commit-hash"]');
  return meta ? meta.getAttribute('content') || '' : '';
};
