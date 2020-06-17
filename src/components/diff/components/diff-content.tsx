import React, { PureComponent } from 'react';
import { cx, css } from 'emotion';

// Note: for consumers of this package via NPM, this Less file gets converted to a
// CSS file during the package "build" step defined in src/components/diff/package.json,
// and the import extension is changed to ".css".
import '../styles.less';

import {
  ChunkEntry,
  DiffEntry,
  DiffInlineRenderProp,
  LineAnnotation,
  OnAddComment,
  OnShowMoreLines,
} from '../types';
import getGutterWidth from '../util/get-gutter-width';

import { getConflictsChecker } from '../util/conflicts-checker';
import { ContentWidthProvider } from '../context/content-width-context';
import ChunkLoader from './chunk-loader';

export type DiffProps = {
  activePermalink?: string;
  diff: DiffEntry;
  filePath?: string;
  inlineContent?: DiffInlineRenderProp;
  isSideBySide: boolean;
  onAddComment?: OnAddComment;
  onPermalinkClick?: (permalink: string) => void;
  onShowMoreLines: OnShowMoreLines;
  showPermalinks: boolean;
  fileAnnotations?: LineAnnotation[];
  isPrAnnotationsEnabled?: boolean;
  isWordWrapEnabled?: boolean;
  isColorBlindModeEnabled?: boolean;
};

type DiffState = {
  gutterWidth: number;
};

function getDummyChunk() {
  return {
    id: 'dummy-chunk',
    changes: [],
    newStart: 0,
    oldStart: 0,
    newLines: 0,
    oldLines: 0,
    content: '',
    extra: {
      before: { hasMoreLines: true },
      after: { hasMoreLines: false },
    },
    isDummyChunk: true,
  };
}

const BITKIT_DIFF_ROOT_CLASSNAME = 'bitkit-diff-wrapper-diff';

export default class DiffContent extends PureComponent<DiffProps, DiffState> {
  static defaultProps = {
    filePath: '',
    isSideBySide: false,
    showPermalinks: false,
    onShowMoreLines: () => {},
  };

  constructor(props: DiffProps) {
    super(props);

    const { diff, isSideBySide } = props;
    this.state = {
      gutterWidth: getGutterWidth(diff, isSideBySide),
    };
  }

  componentWillReceiveProps(nextProps: DiffProps): void {
    const { diff, isSideBySide } = nextProps;

    this.setState({ gutterWidth: getGutterWidth(diff, isSideBySide) });
  }

  renderChunks(): JSX.Element[] {
    const { diff, fileAnnotations, isPrAnnotationsEnabled } = this.props;
    const { chunks } = diff;
    const lastChunk = chunks[chunks.length - 1] as ChunkEntry | undefined; // can be undefined if chunks.length === 0
    const dummyEndChunk = getDummyChunk();

    /* CHECK AND FLAG CONFLICTS. REMOVE WHEN MERGE CONFLICTS API IS FUNCTIONAL */
    const conflictsChecker = getConflictsChecker();
    const checkedChunks = chunks.map(chunk => ({
      ...chunk,
      changes: chunk.changes && chunk.changes.map(conflictsChecker),
    }));

    if (lastChunk?.extra?.after?.hasMoreLines) {
      checkedChunks.push(dummyEndChunk);
    }

    return checkedChunks.map(
      (chunk: ChunkEntry, chunkIndex: number): JSX.Element => {
        const {
          activePermalink,
          filePath,
          isSideBySide,
          inlineContent,
          onAddComment,
          onShowMoreLines,
          onPermalinkClick,
          showPermalinks,
          isWordWrapEnabled,
        } = this.props;

        return (
          <ChunkLoader
            activePermalink={activePermalink}
            key={chunk.content}
            chunk={chunk}
            chunkIndex={chunkIndex}
            filePath={filePath}
            inlineContent={inlineContent}
            isSideBySide={isSideBySide}
            onAddComment={onAddComment}
            onShowMoreLines={onShowMoreLines}
            onPermalinkClick={onPermalinkClick}
            showPermalinks={showPermalinks}
            fileAnnotations={fileAnnotations}
            isPrAnnotationsEnabled={isPrAnnotationsEnabled}
            isWordWrapEnabled={Boolean(isWordWrapEnabled)}
          />
        );
      }
    );
  }

  render() {
    const { isColorBlindModeEnabled, isWordWrapEnabled } = this.props;
    const { gutterWidth } = this.state;

    // Rather than passing the calculated gutterWidth value down as a prop, it is provided via
    // CSS class names. Once IE 11 support is dropped (end of June 2020) CSS variables can be used
    // to cascade the gutterWidth value and the @emotion/babel-preset-css-prop entry can be removed
    // from babel.config.json
    const gutterWidthStyles = css`
      .gutter-width {
        &-apply-padding-left {
          padding-left: ${gutterWidth}px;
        }

        &-apply-width {
          width: ${gutterWidth}px;
        }

        &-apply-flex: {
          flex: 0 0 ${gutterWidth}px;
        }

        &-apply-left {
          left: ${gutterWidth}px;
        }

        &-apply-negative-left-margin {
          margin-left: ${-gutterWidth}px;
        }

        &-apply-max-width-calc {
          max-width: calc(100% + ${gutterWidth}px);
        }
      }
    `;

    return (
      <ContentWidthProvider>
        <div
          className={cx(BITKIT_DIFF_ROOT_CLASSNAME, gutterWidthStyles, {
            'feature-color-blind-mode': isColorBlindModeEnabled,
            'feature-word-wrap': isWordWrapEnabled,
          })}
        >
          <div className="chunks-wrapper">{this.renderChunks()}</div>
        </div>
      </ContentWidthProvider>
    );
  }
}
