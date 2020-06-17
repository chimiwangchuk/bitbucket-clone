import { gridSize } from '@atlaskit/theme';

import { DiffEntry } from '../types';

export type GutterWidthOptions = {
  isSideBySide: boolean;
  maxLineNumber: number;
};

export function getMaxLineNumber(diff: DiffEntry): number {
  let maxLineNumber = 0;
  const chunkLength = diff.chunks.length;
  if (!chunkLength) {
    return maxLineNumber;
  }

  const { newStart, newLines, oldStart, oldLines } = diff.chunks[
    chunkLength - 1
  ];

  if (newStart) {
    maxLineNumber = Math.max(maxLineNumber, newStart + newLines);
  }

  if (oldStart) {
    maxLineNumber = Math.max(maxLineNumber, oldStart + oldLines);
  }

  return maxLineNumber;
}

function getOrder(lineNumber: number): number {
  return lineNumber.toString().length;
}

export function computeGutterWidth({
  isSideBySide,
  maxLineNumber,
}: GutterWidthOptions): number {
  const order = getOrder(maxLineNumber);

  // Side by side case by default.
  let gutterWidth = order * gridSize();

  // Unified diff (2 line numbers + offset).
  if (!isSideBySide) {
    gutterWidth = gutterWidth * 2 + gridSize();
  }

  // Add offset
  return gutterWidth + 2 * gridSize();
}

export default function getGutterWidth(
  diff: DiffEntry,
  isSideBySide: boolean
): number {
  const maxLineNumber = getMaxLineNumber(diff);
  const gutterWidth = computeGutterWidth({
    maxLineNumber,
    isSideBySide,
  });

  return gutterWidth;
}
