const uuidRe = new RegExp(
  '^{([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})}$'
);

/**
 * Verifies the supplied string is a valid UUID in the Bitbucket API format (with curlies)
 * and returns the raw UUID string without curlies.
 * @param {string} uuid
 * @returns {string} The UUID if it passed format checking, or empty string otherwise
 */
export const uncurlyUuid = (uuid: string): string => {
  const match = uuidRe.exec(uuid);
  if (!match) {
    return '';
  }
  return match[1];
};
