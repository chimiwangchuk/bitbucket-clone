import React, { PureComponent } from 'react';

import {
  ChunkEntry,
  DiffInlineRenderProp,
  LineAnnotation,
  OnAddComment,
  OnShowMoreLines,
} from '../types';

import ChunkContainer from './chunk-container';

export type ChunkLoaderProps = {
  activePermalink?: string;
  filePath?: string;
  inlineContent?: DiffInlineRenderProp;
  isSideBySide: boolean;
  chunk: ChunkEntry;
  chunkIndex: number;
  onAddComment?: OnAddComment;
  onPermalinkClick?: (permalink: string) => void;
  onShowMoreLines: OnShowMoreLines;
  showPermalinks: boolean;
  fileAnnotations?: LineAnnotation[];
  isPrAnnotationsEnabled?: boolean;
  isWordWrapEnabled: boolean;
};

export type ChunkLoaderState = {
  chunk: ChunkEntry;
};

export default class ChunkLoader extends PureComponent<
  ChunkLoaderProps,
  ChunkLoaderState
> {
  state = {
    chunk: this.props.chunk,
  };

  componentWillReceiveProps(nextProps: ChunkLoaderProps): void {
    if (nextProps.chunk !== this.props.chunk) {
      this.setState({ chunk: nextProps.chunk });
    }
  }

  handleShowMoreLines = () => {
    const { chunkIndex, onShowMoreLines } = this.props;
    const expanderIndex = chunkIndex;
    const { chunk } = this.state;
    const { extra } = chunk;
    const { before } = extra;
    const newChunk = {
      ...chunk,
      extra: {
        ...extra,
        before: { ...before, isLoading: true },
      },
    };

    this.setState({ chunk: newChunk });
    onShowMoreLines(expanderIndex);
  };

  render() {
    const {
      activePermalink,
      isSideBySide,
      filePath,
      inlineContent,
      onAddComment,
      onPermalinkClick,
      showPermalinks,
      fileAnnotations,
      isPrAnnotationsEnabled,
      isWordWrapEnabled,
    } = this.props;
    const { chunk } = this.state;

    return (
      <ChunkContainer
        activePermalink={activePermalink}
        filePath={filePath}
        onShowMoreLines={this.handleShowMoreLines}
        chunk={chunk}
        inlineContent={inlineContent}
        isSideBySide={isSideBySide}
        onAddComment={onAddComment}
        onPermalinkClick={onPermalinkClick}
        showPermalinks={showPermalinks}
        fileAnnotations={fileAnnotations}
        isPrAnnotationsEnabled={isPrAnnotationsEnabled}
        isWordWrapEnabled={isWordWrapEnabled}
      />
    );
  }
}
