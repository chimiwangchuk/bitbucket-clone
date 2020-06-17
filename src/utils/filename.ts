export const cleanPath = (filepath: string | null | undefined) => {
  if (!filepath) {
    return '';
  }
  return filepath.substring(filepath.lastIndexOf('/') + 1);
};
