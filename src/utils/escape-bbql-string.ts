/**
 * BBQL values cannot contain unescaped double quotes
 *
 * @param {string} str
 * @returns {string}
 */
export default function(str: string) {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}
