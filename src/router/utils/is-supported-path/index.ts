const SUPPORTED_PATHS = [
  // NOTE - '/' is supported because it redirects to /dashboard/overview
  '/',
  '/dashboard/overview',
  '/dashboard/repositories',
];

export const isSupportedPath = (pathname: string) => {
  return SUPPORTED_PATHS.includes(pathname);
};
