import React, { PureComponent } from 'react';
import { cx } from 'emotion';

import { LoadedContent } from '../types';

import { ChunkHeader } from './chunk-header';

export type ChunkControlsProps = {
  before: LoadedContent;
  heading: string;
  children: JSX.Element | JSX.Element[] | null;
  onShowMoreLines: () => void;
  isDummyChunk?: boolean;
  isSideBySide?: boolean;
  isWordWrapEnabled: boolean;
};

export default class ChunkControls extends PureComponent<ChunkControlsProps> {
  render() {
    const {
      children,
      heading,
      before,
      onShowMoreLines,
      isDummyChunk,
      isSideBySide,
      isWordWrapEnabled,
    } = this.props;

    const header = (
      <ChunkHeader
        heading={heading}
        before={before}
        onShowMoreLines={onShowMoreLines}
        isDummyChunk={isDummyChunk}
        isSideBySide={isSideBySide}
        isWordWrapEnabled={isWordWrapEnabled}
      />
    );

    return (
      <div className="diff-chunk">
        {children ? (
          <div
            className={cx('diff-chunk-inner', { 'side-by-side': isSideBySide })}
          >
            {header}
            {children}
          </div>
        ) : (
          header
        )}
      </div>
    );
  }
}
