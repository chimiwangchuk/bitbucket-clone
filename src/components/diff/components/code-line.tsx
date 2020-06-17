import React from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import { cx } from 'emotion';

import {
  DiffInlineRenderProp,
  HideLines,
  Line,
  LineAnnotation as LineAnnotationType,
  OnAddComment,
} from '../types';
import messages from '../i18n';
import withTap from './with-tap';
import { InlineContent } from './inline-content';
import LineAnnotation from './line-annotation';
import { LineNumberDetails, LineNumbers } from './line-numbers';

const Code = withTap(props => <pre {...props} />);

type InjectedProps = { intl: InjectedIntl };

export type CodeLineProps = HideLines &
  InjectedProps & {
    activePermalink?: string;
    line: Line;
    filePath?: string;
    index: number;
    inlineContent?: DiffInlineRenderProp;
    onAddComment?: OnAddComment;
    showPermalinks: boolean;
    onPermalinkClick?: (permalink: string) => void;
    lineAnnotations?: LineAnnotationType[];
    isPrAnnotationsEnabled?: boolean;
  };

export class BaseCodeLine extends React.PureComponent<CodeLineProps> {
  addCommentButton: HTMLButtonElement | undefined;

  renderInlineContent(isActive: boolean) {
    const { inlineContent, line } = this.props;

    return (
      <InlineContent
        inlineContent={inlineContent}
        line={line}
        isActive={isActive}
      />
    );
  }

  onAddComment = (event: React.SyntheticEvent | MouseEvent) => {
    event.preventDefault();
    const { line, onAddComment } = this.props;

    if (onAddComment && line.type !== 'empty') {
      const { oldLine: from, newLine: to } = line;
      onAddComment({ from, to });
    }
  };

  createUnifiedPermalink = (line: Line, filePath: string): string => {
    return `L${filePath}${line.oldLine ? `F${line.oldLine}` : ''}${
      line.newLine ? `T${line.newLine}` : ''
    }`;
  };

  createSideBySidePermalink = (
    line: Line,
    filePath: string,
    hideNewLines?: boolean
  ) => {
    const lineType = hideNewLines ? 'oldline' : 'newline';
    const lineNumber = hideNewLines ? line.oldLine : line.newLine;
    return `chg_${filePath}_${lineType}${lineNumber}`;
  };

  createPermalink = () => {
    const { line, filePath, hideNewLines, hideOldLines } = this.props;
    if (!filePath) {
      return '';
    }
    if (hideNewLines || hideOldLines) {
      return this.createSideBySidePermalink(line, filePath, hideNewLines);
    }
    return this.createUnifiedPermalink(line, filePath);
  };

  getAriaLabelForLineType = (type: string, intl: InjectedIntl): string => {
    const ariaLabelLineTypeMap: { add: string; del: string; normal: string } = {
      add: intl.formatMessage(messages.lineAdded),
      del: intl.formatMessage(messages.lineDeleted),
      normal: intl.formatMessage(messages.lineNormal),
    };

    // @ts-ignore TODO: fix noImplicitAny error here
    return ariaLabelLineTypeMap[type] || ' ';
  };

  getLineTypeSymbol = (type: string): string => {
    const lineTypeSymbolMap: { add: string; del: string; normal: string } = {
      add: '+',
      del: '-',
      normal: '',
    };

    // @ts-ignore TODO: fix noImplicitAny error here
    return lineTypeSymbolMap[type] || ' ';
  };

  getLineNumberDetails(): LineNumberDetails[] {
    const { intl, hideOldLines, hideNewLines, line } = this.props;

    if (hideOldLines && hideNewLines) {
      return [];
    }

    const { oldLine, newLine } = line;

    const oldLineDetails = {
      number: oldLine,
      label: intl.formatMessage(messages.fromLine, {
        lineNumber: oldLine,
      }),
    };
    const newLineDetails = {
      number: newLine,
      label: intl.formatMessage(messages.toLine, {
        lineNumber: newLine,
      }),
    };

    if (hideOldLines && !hideNewLines) {
      return [newLineDetails];
    } else if (!hideOldLines && hideNewLines) {
      return [oldLineDetails];
    }

    return [oldLineDetails, newLineDetails];
  }

  render() {
    const {
      activePermalink,
      line,
      index,
      intl,
      inlineContent,
      onAddComment,
      showPermalinks,
      lineAnnotations,
      isPrAnnotationsEnabled,
      onPermalinkClick,
    } = this.props;

    const { content, type, conflictType, wordDiff } = line;
    const isEmptyLine = line.type === 'empty';
    const permalink = this.createPermalink();

    const isActivePermalink = showPermalinks && activePermalink === permalink;

    const lineNumbers: LineNumberDetails[] = this.getLineNumberDetails();

    return (
      <div
        className={cx(
          'line-wrapper',
          'gutter-width-apply-padding-left',
          `type-${type}`,
          {
            [`has-conflict-${conflictType}`]: Boolean(conflictType),
            active: isActivePermalink,
          }
        )}
        key={`chunk-line-${index}`}
        data-qa="code-line"
        id={permalink || undefined}
        role="group"
        aria-label={this.getAriaLabelForLineType(type, intl)}
      >
        <LineNumbers
          isActivePermalink={isActivePermalink}
          lineNumbers={lineNumbers}
          onPermalinkClick={onPermalinkClick}
          permalink={permalink}
          showPermalinks={showPermalinks}
        />
        {onAddComment && !isEmptyLine && (
          <button
            className="add-comment-button"
            onClick={this.onAddComment}
            onTouchEnd={this.onAddComment}
            aria-label={intl.formatMessage(messages.addComment)}
            tabIndex={0}
          />
        )}
        <Code className="code-component" onTap={this.onAddComment}>
          <span className="line-type" aria-hidden>
            {this.getLineTypeSymbol(type)}
          </span>

          {wordDiff ? (
            <span
              className="code-diff"
              dangerouslySetInnerHTML={{ __html: wordDiff.slice(1) }}
            />
          ) : (
            <span className="code-diff">{content.slice(1)}</span>
          )}
        </Code>
        {isPrAnnotationsEnabled &&
        lineAnnotations &&
        lineAnnotations.length &&
        (type === 'add' || type === 'normal') ? (
          <LineAnnotation lineAnnotations={lineAnnotations} />
        ) : null}
        {inlineContent && this.renderInlineContent(isActivePermalink)}
      </div>
    );
  }
}

export const CodeLine = injectIntl(BaseCodeLine);
