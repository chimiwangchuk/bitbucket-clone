import React, { memo } from 'react';
import { cx } from 'emotion';
import { LineLink } from './line-link';

type OwnProps = {
  isActivePermalink: boolean;
  lineNumbers: LineNumberDetails[];
  permalink: string;
  onPermalinkClick?: (permalink: string) => void;
  showPermalinks: boolean;
};

export type LineNumberDetails = {
  number?: number;
  label?: string;
};

export const LineNumbers: React.FC<OwnProps> = memo(
  ({
    isActivePermalink,
    lineNumbers,
    showPermalinks,
    onPermalinkClick,
    permalink,
  }) => {
    return (
      <div
        className={cx('line-numbers', 'gutter-width-apply-width', {
          active: isActivePermalink,
        })}
      >
        {lineNumbers.map(({ number, label }, i) =>
          showPermalinks ? (
            <LineLink
              key={`line-number-${number}-${i}`}
              number={number}
              label={label}
              permalink={permalink}
              onPermalinkClick={onPermalinkClick}
            />
          ) : (
            <div
              className="line-number"
              key={`line-number-${number}-${i}`}
              aria-hidden={!number}
              aria-label={label}
            >
              <span aria-hidden="true">{number}</span>
            </div>
          )
        )}
      </div>
    );
  }
);
