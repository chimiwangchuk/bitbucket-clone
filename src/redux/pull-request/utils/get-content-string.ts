import { ChunkEntry } from '@atlassian/bitkit-diff';

export function getContentString(c: ChunkEntry) {
  return `@@ -${c.oldStart},${c.oldLines} +${c.newStart},${c.newLines} @@`;
}
