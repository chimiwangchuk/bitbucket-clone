import React, { memo } from 'react';

import { LoadedContent } from '../types';
import ShowMoreLinesButton from './show-more-lines-button';

type OwnProps = {
  before: LoadedContent;
  heading: string;
  onShowMoreLines: () => void;
  isDummyChunk?: boolean;
  isSideBySide?: boolean;
  isWordWrapEnabled: boolean;
};

export const ChunkHeader: React.FC<OwnProps> = memo(
  ({
    heading,
    before,
    onShowMoreLines,
    isDummyChunk,
    isSideBySide,
    isWordWrapEnabled,
  }) => {
    if (isSideBySide && isWordWrapEnabled) {
      return (
        <div className="side-by-side-lines-wrapper">
          <div className="chunk-heading-wrapper gutter-width-apply-padding-left">
            <ShowMoreLinesButton
              hasMoreLines={before && before.hasMoreLines}
              onShowMoreLines={onShowMoreLines}
              isLoading={before && !!before.isLoading}
              isDummyChunk={isDummyChunk}
            />
            <div className="chunk-heading">{heading}</div>
          </div>
          <div className="chunk-heading-wrapper gutter-width-apply-padding-left">
            <ShowMoreLinesButton
              hasMoreLines={before && before.hasMoreLines}
              onShowMoreLines={onShowMoreLines}
              isLoading={before && !!before.isLoading}
              isDummyChunk={isDummyChunk}
            />
            <div className="chunk-heading">{heading}</div>
          </div>
        </div>
      );
    }

    return (
      <div className="chunk-heading-wrapper gutter-width-apply-padding-left">
        <ShowMoreLinesButton
          hasMoreLines={before && before.hasMoreLines}
          onShowMoreLines={onShowMoreLines}
          isLoading={before && !!before.isLoading}
          isDummyChunk={isDummyChunk}
        />

        <div className="chunk-heading">{heading}</div>
      </div>
    );
  }
);
