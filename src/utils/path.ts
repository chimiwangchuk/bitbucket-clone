// React router (well, the `history` module inside it) calls `decodeURI` when
// setting a location. This decodes *some* special characters, but not all. So
// we have to do some safety work in order to handle encoded paths:
//
// - Encoding: `history` calls `encodeURI`, but we need to call
//   `encodeURIComponent` to catch all special characters, so we need to sort of
//   encode twice (for now, just a few chars that cause trouble)
//
// - Decoding: The browser back and forward buttons don't go through
//   react-router, so the path might already be decoded. So if decoding fails,
//   we'll just try to return the path as-is
//
// To reiterate, this only needs to be done for paths that will touch
// react-router; we don't need to safe encode/decode URLs for use in django
//
// See https://github.com/ReactTraining/history/issues/505#issuecomment-359538055

export const safeEncode = (path: string) =>
  encodeURIComponent(path.replace(/%/g, '%25').replace(/#/g, '%23'));

export const safeEncodePath = (path: string) => {
  return path
    .split('/')
    .map(safeEncode)
    .join('/');
};

/**
 * Safely decode a single path element.
 *
 * @param {string} path The string to decode
 */
export const safeDecode = (path: string) => {
  try {
    return decodeURIComponent(path);
  } catch (e) {
    return path;
  }
};

/**
 * Safely decode an entire path by splitting elements on `/`.
 *
 * @param {string} path The full path to decode
 */
export const safeDecodePath = (path: string) => {
  return path
    .split('/')
    .map(safeDecode)
    .join('/');
};
