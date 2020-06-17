import { Line, DiffInlineRenderProp } from '../types';

export const lineHasInlineContent = (
  line: Line,
  inlineContent?: DiffInlineRenderProp
) => {
  const { oldLine, newLine, content } = line;

  return (
    !!inlineContent &&
    !!inlineContent({
      lineFrom: oldLine,
      lineTo: newLine,
      content,
    })
  );
};
