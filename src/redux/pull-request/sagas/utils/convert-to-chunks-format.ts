/**
 * Convert incoming context lines to match the format
 * of the existing diff chunks. Also flags if there are
 * more lines of content available.
 */
import { Line } from '@atlassian/bitkit-diff';
import { ApiContextLine } from '../expand-context-saga';

export type ContextLine = Line & {
  type: 'normal';
  normal: true;
};

// @ts-ignore TODO: fix noImplicitAny error here
function formatLine(line) {
  return {
    normal: true, // Context lines are always 'normal'
    type: 'normal',
    oldLine: line.from_line,
    newLine: line.to_line,
    content: line.content,
  };
}

export function convertToChunksFormat(originalContextLines: ApiContextLine[]) {
  const converted = {
    hasMoreLines: false,
    contextLines: [],
  } as any;

  const firstLine = originalContextLines[0];
  const lastLine = originalContextLines[originalContextLines.length - 1];
  let trimmedContextLines;

  if (!Array.isArray(originalContextLines) || !originalContextLines.length) {
    return converted;
  }

  // The 1.0 context api adds this line to the returned array
  // to indicate there is more content available:
  // {content: "", from_line: null, to_line: null, conflict: false}

  // This is added either at the start or end of the array depending
  // on the fetch.

  if (firstLine.from_line === null && firstLine.to_line === null) {
    converted.hasMoreLines = true;
    trimmedContextLines = originalContextLines.slice(1);
  } else if (lastLine.from_line === null && lastLine.to_line === null) {
    converted.hasMoreLines = true;
    trimmedContextLines = originalContextLines.slice(0, -1);
  }

  converted.contextLines = (trimmedContextLines || originalContextLines).map(
    formatLine
  );

  return converted;
}
