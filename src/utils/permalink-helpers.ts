/* eslint-disable consistent-return */
export const COMMENT_PERMALINK_MATCHER = /^comment-/;
export const SIDEBAR_EXPANDER_HASH_MATCHER = /^sidebar-/;
export const LINE_PERMALINK_MATCHER = /^L|^chg_/;
export const SIDE_BY_SIDE_LINE_PERMALINK_MATCHER = /^chg_/;
export const FILEPATH_PERMALINK_MATCHER = /^chg-/;

export const getPermalink = () => {
  try {
    const hash = decodeURIComponent(window.location.hash);
    return hash.slice(1);
  } catch (e) {
    // URIError: malformed URI sequence
    // eslint-disable-next-line no-useless-return
    return;
  }
};

// @ts-ignore TODO: fix noImplicitAny error here
export const getFilepathFromLinePermalink = permalink => {
  // Regex to parse out the filepath (and other pieces) from a permalink:
  // /(^L)(.*?)(F(\d+))?(T(\d+))?$/
  //
  // This will return:
  // [permalink, linePermalinkPrefix, filepath, from, fromLineNumber, to, toLineNumber]
  //
  // e.g. if you pass in 'Lfilename.jsF1T2' you'll get:
  // ['Lfilename.jsF1T2', 'L', 'filename.js', 'F1', '1', T2', '2']
  /* prettier-ignore */
  try {
    const [, , filepath, , , , ] = /(^L)((.|\n)*?)(F(\d+))?(T(\d+))?$/.exec(permalink);
    return filepath;
  } catch (e) {
    // eslint-disable-next-line no-useless-return
    return;
  }
};

// @ts-ignore TODO: fix noImplicitAny error here
export const getFilePathFromSideBySidePermalink = permalink => {
  try {
    const [, filepath] = /^chg_((.|\n)*?)_(newline|oldline)(\d+)$/.exec(
      permalink
    );
    return filepath;
  } catch (e) {
    // eslint-disable-next-line no-useless-return
    return;
  }
};

// @ts-ignore TODO: fix noImplicitAny error here
export const getFilepath = permalink => {
  return (
    getFilePathFromSideBySidePermalink(permalink) ||
    getFilepathFromLinePermalink(permalink)
  );
};

// @ts-ignore TODO: fix noImplicitAny error here
export const getFilepathAnchorId = filepath => {
  return `chg-${filepath}`;
};

const urlEncodeWhitespace = (permalink: string) =>
  permalink
    .split('')
    .map(chr => (['\t', '\n'].includes(chr) ? encodeURIComponent(chr) : chr))
    .join('');

export const updateHashInURL = (
  activePermalink: string,
  isDiffStatEscapedFilePathsEnabled: boolean
) => {
  // Prevent the browser from doing additional scrolling by
  // updating the URL in a way that doens't trigger a hashchange
  // event but still allows the back & forward button to work.
  const currentPermalink = getPermalink();
  const currentUrl = decodeURI(window.location.href);

  const newPermalink = isDiffStatEscapedFilePathsEnabled
    ? urlEncodeWhitespace(activePermalink)
    : activePermalink;

  if (currentPermalink) {
    if (currentPermalink !== activePermalink) {
      const newUrl = currentUrl.replace(currentPermalink, newPermalink);
      history.pushState({}, '', newUrl);
    }
  } else {
    history.pushState({}, '', `${currentUrl}#${newPermalink}`);
  }
};

export const isSameCommentPermalink = (commentId: string) => {
  const newPermalink = `comment-${commentId}`;
  const currentPermalink = getPermalink();
  return newPermalink === currentPermalink;
};
