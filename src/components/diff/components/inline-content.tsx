import React, { useContext } from 'react';
import { cx } from 'emotion';
import { gridSize } from '@atlaskit/theme';

import { Line, DiffInlineRenderProp } from '../types';
import { ContentWidthContext } from '../context/content-width-context';

// Ak Page widths copied from @atlaskit/page because they can't be imported
const defaultGridColumnWidth = gridSize() * 10; // 80
const fixedGridPageWidth = `${defaultGridColumnWidth * 12}px`; // 960

export type Props = {
  inlineContent?: DiffInlineRenderProp;
  line: Line;
  isActive: boolean;
};

export const InlineContent: React.FunctionComponent<Props> = ({
  inlineContent,
  line,
  isActive,
}) => {
  const { oldLine, newLine, content, conflictType, type } = line;

  const contentWidth = useContext(ContentWidthContext);

  return (
    <div
      className="inline-content-wrapper gutter-width-apply-negative-left-margin gutter-width-apply-max-width-calc gutter-width-apply-left"
      style={{
        width: contentWidth || fixedGridPageWidth,
      }}
    >
      <div
        className={cx(
          'line-numbers',
          'gutter-width-apply-width',
          'gutter-width-apply-flex',
          { active: isActive }
        )}
      />
      <div
        className={cx('inline-content', 'gutter-width-apply-left', {
          [`type-${type}`]: Boolean(type),
          [`has-conflict-${conflictType}`]: Boolean(conflictType),
          active: isActive,
        })}
      >
        <div className="bitkit-diff-inline-content-container">
          {inlineContent &&
            inlineContent({
              lineFrom: oldLine,
              lineTo: newLine,
              content,
            })}
        </div>
      </div>
    </div>
  );
};
