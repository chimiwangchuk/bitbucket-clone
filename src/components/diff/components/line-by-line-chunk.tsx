import React, { memo } from 'react';
import {
  ChunkEntry,
  DiffInlineRenderProp,
  LineAnnotation,
  OnAddComment,
} from '../types';
import groupChunk from '../util/group-chunk';
import getLineAnnotations from '../util/get-line-annotations';
import { lineHasInlineContent } from '../util/line-has-inline-content';
import { CodeLine } from './code-line';
import ChunkControls from './chunk-controls';

type OwnProps = {
  activePermalink?: string;
  chunk: ChunkEntry;
  filePath?: string;
  inlineContent?: DiffInlineRenderProp;
  onAddComment?: OnAddComment;
  onShowMoreLines: () => void;
  showPermalinks: boolean;
  onPermalinkClick?: (permalink: string) => void;
  fileAnnotations?: LineAnnotation[];
  isPrAnnotationsEnabled?: boolean;
  isWordWrapEnabled: boolean;
};

export const LineByLineChunk = memo(
  ({
    chunk,
    onShowMoreLines,
    activePermalink,
    filePath,
    showPermalinks,
    onPermalinkClick,
    onAddComment,
    inlineContent,
    isWordWrapEnabled,
    fileAnnotations,
    isPrAnnotationsEnabled,
  }: OwnProps) => {
    const { before, after } = groupChunk(chunk);

    return (
      <ChunkControls
        before={chunk.extra.before}
        heading={chunk.content}
        onShowMoreLines={onShowMoreLines}
        isSideBySide
        isWordWrapEnabled={isWordWrapEnabled}
      >
        {before.changes.map((_, index) => {
          const beforeLine = before.changes[index];
          const afterLine = after.changes[index];

          // unchanged lines' content should only appear on left (before) side
          const isUnchanged =
            beforeLine.type === 'normal' && afterLine.type === beforeLine.type;

          return (
            <div className="side-by-side-lines-wrapper" key={index}>
              <CodeLine
                activePermalink={activePermalink}
                filePath={filePath}
                index={index}
                line={beforeLine}
                showPermalinks={showPermalinks}
                hideNewLines
                onPermalinkClick={onPermalinkClick}
                onAddComment={onAddComment}
                inlineContent={
                  lineHasInlineContent(beforeLine, inlineContent)
                    ? inlineContent
                    : undefined
                }
              />
              <CodeLine
                activePermalink={activePermalink}
                filePath={filePath}
                index={index}
                line={afterLine}
                showPermalinks={showPermalinks}
                hideOldLines
                onPermalinkClick={onPermalinkClick}
                onAddComment={onAddComment}
                lineAnnotations={getLineAnnotations(
                  fileAnnotations,
                  afterLine.newLine
                )}
                isPrAnnotationsEnabled={isPrAnnotationsEnabled}
                inlineContent={
                  !isUnchanged && lineHasInlineContent(afterLine, inlineContent)
                    ? inlineContent
                    : undefined
                }
              />
            </div>
          );
        })}
      </ChunkControls>
    );
  }
);
