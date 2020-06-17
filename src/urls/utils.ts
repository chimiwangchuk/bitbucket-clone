import qs from 'qs';

export const encodeBranchName = (branchName: string) =>
  // Encode `#` - Fragment Identifiers are only client-side in HTTP request URLs
  branchName.replace(/#/g, '%23');

export const encodePath = (path: string | null | undefined) =>
  (path || '')
    .split('/')
    .map(encodeURIComponent)
    .join('/');

export const stringify = (params: object, extraOptions: any = {}) =>
  qs.stringify(params, {
    addQueryPrefix: true,
    skipNulls: true,
    ...extraOptions,
  });
