import { ChunkEntry } from '@atlassian/bitkit-diff';

type ContextExpansionLine = {
  content: string;
  from_line: number;
  conflict: boolean;
  to_line: number;
};

export const buildChunk = (lines: ContextExpansionLine[]): ChunkEntry => {
  const content = `@@ -${lines[0].from_line},${lines.length} +${lines[0].to_line},${lines.length} @@`;

  return {
    id: content,
    content,
    oldStart: lines[0].from_line,
    oldLines: lines.length,
    newStart: lines[0].to_line,
    newLines: lines.length,
    extra: {
      // @ts-ignore ChunkEntry from BK diff needs updating?
      isLoading: false,
      before: { hasMoreLines: true },
      after: { hasMoreLines: true },
    },
    // @ts-ignore ChunkEntry from BK diff needs updating?
    changes: lines.map((line: ContextExpansionLine) => ({
      type: 'normal',
      normal: true,
      oldLine: line.from_line,
      newLine: line.to_line,
      content: line.content,
    })),
  };
};
