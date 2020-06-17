import React from 'react';

import {
  ChunkEntry,
  DiffInlineRenderProp,
  LineAnnotation,
  OnAddComment,
} from '../types';

import groupChunk from '../util/group-chunk';
import Chunk from './chunk';
import { LineByLineChunk } from './line-by-line-chunk';

export type ChunkContainerProps = {
  activePermalink?: string;
  chunk: ChunkEntry;
  filePath?: string;
  isSideBySide: boolean;
  inlineContent?: DiffInlineRenderProp;
  onShowMoreLines: () => void;
  onAddComment?: OnAddComment;
  showPermalinks: boolean;
  onPermalinkClick?: (permalink: string) => void;
  fileAnnotations?: LineAnnotation[];
  isPrAnnotationsEnabled?: boolean;
  isWordWrapEnabled: boolean;
};

export default function ChunkContainer(props: ChunkContainerProps) {
  const {
    activePermalink,
    filePath,
    isSideBySide,
    inlineContent,
    chunk,
    onShowMoreLines,
    onAddComment,
    showPermalinks,
    onPermalinkClick,
    fileAnnotations,
    isPrAnnotationsEnabled,
    isWordWrapEnabled,
  } = props;

  const commonProps = {
    activePermalink,
    onShowMoreLines,
    filePath,
    showPermalinks,
    onPermalinkClick,
    isPrAnnotationsEnabled,
    isWordWrapEnabled,
  };

  if (isSideBySide) {
    if (isWordWrapEnabled) {
      return (
        <div className="chunk-wrapper">
          <LineByLineChunk
            {...commonProps}
            chunk={chunk}
            onAddComment={onAddComment}
            inlineContent={inlineContent}
            fileAnnotations={fileAnnotations}
          />
        </div>
      );
    }

    const { before, after } = groupChunk(chunk);
    return (
      <div className="chunk-wrapper">
        <div className="side-by-side-chunk">
          <Chunk
            {...commonProps}
            fileAnnotations={[]}
            hideNewLines
            chunk={before}
          />
          <Chunk
            {...commonProps}
            fileAnnotations={fileAnnotations}
            hideOldLines
            chunk={after}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="chunk-wrapper">
      <Chunk
        {...commonProps}
        chunk={chunk}
        onAddComment={onAddComment}
        inlineContent={inlineContent}
        fileAnnotations={fileAnnotations}
      />
    </div>
  );
}
