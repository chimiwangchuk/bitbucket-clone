import { Line } from '../types';

/**
 * Strings taken from Bitbucket core:
 * https://staging.bb-inf.net/bitbucket/bitbucket/src/staging/apps/repo2/diffparser.py#diffparser.py-9:11
 */
const CONFLICT_START_MARKER = '+<<<<<<<';
const CONFLICT_DIVIDER = '+=======';
const CONFLICT_END_MARKER = '+>>>>>>>';

/**
 * Utility class for checking a sequence of lines of code for conflict markers.
 */
export class ConflictsChecker {
  inConflict = false;

  /**
   * Flags lines of code that are in conflict.
   * @param {Line} line The line of code that has changed.
   * @returns {Line} The line of code returned with a flag indicating a conflict, if required.
   */
  check(line: Line) {
    const prefix = line.content.substr(0, 8);
    const checkedLine = { ...line };

    // Normal code
    if (!this.inConflict && prefix === CONFLICT_START_MARKER) {
      this.inConflict = true;
      checkedLine.conflictType = 'marker';
    } else if (this.inConflict) {
      // Conflicted code
      switch (prefix) {
        case CONFLICT_DIVIDER:
          checkedLine.conflictType = 'marker';
          break;

        case CONFLICT_END_MARKER:
          checkedLine.conflictType = 'marker';
          this.inConflict = false;
          break;

        default:
          checkedLine.conflictType = 'content';
          break;
      }
    }

    return checkedLine;
  }
}

/**
 * Get an instance of the ConflictsChecker class
 */
export const getConflictsChecker = () => {
  const checker = new ConflictsChecker();
  const check = checker.check.bind(checker) as typeof checker.check;
  return check;
};
