const aaidRe = new RegExp('^{([^}]+)}$');

/**
 * Verifies the supplied string is a valid AAID in the Bitbucket @-mention
 * serialization/linkification format and returns the raw AAID string without curlies.
 * @param {string} aaid
 * @returns {?string} The Atlassian Account Id if it passed format checking, or `null` otherwise
 */
export const uncurlyAaid = (aaid: string): string | null => {
  const match = aaidRe.exec(aaid);
  return match ? match[1] : null;
};
