import React, { PureComponent, Fragment } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';

import {
  ChunkEntry,
  DiffInlineRenderProp,
  HideLines,
  Line,
  LineAnnotation,
  OnAddComment,
} from '../types';
import groupChanges from '../util/group-changes';
import getLineAnnotations from '../util/get-line-annotations';
import { lineHasInlineContent } from '../util/line-has-inline-content';

import ChunkControls from './chunk-controls';
import { CodeLine } from './code-line';

export type ChunkProps = HideLines & {
  activePermalink?: string;
  chunk: ChunkEntry;
  filePath?: string;
  inlineContent?: DiffInlineRenderProp;
  onAddComment?: OnAddComment;
  onShowMoreLines: () => void;
  intl: InjectedIntl;
  showPermalinks: boolean;
  onPermalinkClick?: (permalink: string) => void;
  fileAnnotations?: LineAnnotation[];
  isPrAnnotationsEnabled?: boolean;
  isWordWrapEnabled: boolean;
};

class Chunk extends PureComponent<ChunkProps> {
  static defaultProps = {
    hideNewLines: false,
    hideOldLines: false,
  };

  renderLines() {
    const { chunk } = this.props;
    const { loadedBefore, loadedAfter, rest } = groupChanges(chunk.changes);

    if (chunk.changes.length) {
      return (
        <Fragment>
          {this.renderLoadedLines(loadedBefore)}
          {rest.map(this.renderCodeLine)}
          {this.renderLoadedLines(loadedAfter)}
        </Fragment>
      );
    }

    return null;
  }

  renderCodeLine = (line: Line, index: number) => {
    const {
      filePath,
      showPermalinks,
      activePermalink,
      onPermalinkClick,
      fileAnnotations,
      isPrAnnotationsEnabled,
    } = this.props;

    let content;

    if (lineHasInlineContent(line, this.props.inlineContent)) {
      content = this.props.inlineContent;
    }

    return (
      <CodeLine
        key={`line-${index}`}
        filePath={filePath}
        index={index}
        line={line}
        hideOldLines={this.props.hideOldLines}
        hideNewLines={this.props.hideNewLines}
        inlineContent={content}
        onAddComment={this.props.onAddComment}
        showPermalinks={showPermalinks}
        onPermalinkClick={onPermalinkClick}
        activePermalink={activePermalink}
        lineAnnotations={getLineAnnotations(fileAnnotations, line.newLine)}
        isPrAnnotationsEnabled={isPrAnnotationsEnabled}
      />
    );
  };

  renderLoadedLines(lines: Line[]) {
    if (lines.length) {
      return (
        <div className="loaded-lines-wrapper">
          {lines.map(this.renderCodeLine)}
        </div>
      );
    }

    return null;
  }

  render() {
    const { chunk, onShowMoreLines, isWordWrapEnabled } = this.props;
    const { before } = chunk.extra;

    return (
      <div className="diff-wrapper" data-qa="chunk">
        <div className="bitkit-diff-wrapper-diff">
          <ChunkControls
            before={before}
            heading={chunk.content}
            onShowMoreLines={onShowMoreLines}
            isDummyChunk={chunk.isDummyChunk}
            isSideBySide={false}
            isWordWrapEnabled={isWordWrapEnabled}
          >
            {this.renderLines()}
          </ChunkControls>
        </div>
      </div>
    );
  }
}

export default injectIntl(Chunk);
