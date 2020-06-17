export const getDceEnv = (): string | null => {
  const envMeta = document.querySelector('meta[name="bb-dce-env"]');
  const env = envMeta ? envMeta.getAttribute('content') : null;
  return env;
};
