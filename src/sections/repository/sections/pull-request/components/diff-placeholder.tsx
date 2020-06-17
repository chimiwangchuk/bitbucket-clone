import React, { useContext, Fragment } from 'react';
import { bitbucketSchema as schema } from '@atlaskit/adf-schema';
import { TextSerializer, renderDocument } from '@atlaskit/renderer';
import Spinner from '@atlaskit/spinner';
import { get } from 'lodash-es';
import styled from '@emotion/styled';
import {
  gridSize,
  colors,
  borderRadius,
  codeFontFamily,
  fontSize,
} from '@atlaskit/theme';

import { Diff } from 'src/types/pull-request';
import ConversationsContext from 'src/contexts/conversations-context';

const serializer = new TextSerializer(schema);

// These are estimates drawn from styles in the Diff package (`src/components/diff`)
const fileHeaderHeight = 40;
const commentHeight = 76;
const nestedCommentMargin = gridSize() * 3.5;
const conversationOverhead = gridSize() * 4;
const codeLineHeight = gridSize() * 2.5;

const estimateHeight = (
  lines: number,
  chunks = 1,
  conversations = 0,
  comments = 0
) => {
  const chunkHeaderHeight = chunks * codeLineHeight;
  const nestedCommentsSpacing =
    Math.max(0, comments - conversations) * nestedCommentMargin;
  const commentsEstimate =
    conversations * conversationOverhead +
    comments * commentHeight +
    nestedCommentsSpacing;
  return (
    lines * codeLineHeight +
    chunkHeaderHeight +
    fileHeaderHeight +
    commentsEstimate
  );
};

const background = `repeating-linear-gradient(${colors.N20}, ${
  colors.N20
} ${fileHeaderHeight}px, ${colors.N40} ${fileHeaderHeight}px, ${
  colors.N40
} ${fileHeaderHeight + 1}px, ${colors.N0} ${fileHeaderHeight}px, ${
  colors.N0
} 100%)`;

const PlaceholderWrapper = styled.pre<{
  lines: number;
  chunks: number;
  conversations: number;
  comments: number;
  isOpen?: boolean;
  'data-qa': string;
}>`
  height: ${({ lines, chunks, conversations, comments, isOpen }) =>
    isOpen
      ? estimateHeight(lines, chunks, conversations, comments)
      : fileHeaderHeight}px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  font-size: ${fontSize()}px;
  font-family: ${codeFontFamily()};
  border: 1px solid ${colors.N40};
  border-radius: ${borderRadius()}px ${borderRadius()}px 0 0;
  background: ${background};
  color: ${colors.N0};
  overflow: hidden;
  word-break: break-all;
`;

const placeholderHeader = {
  fontSize: `${fontSize()}px`,
  fontFamily: codeFontFamily(),
  color: colors.N0,
};

const DEFAULT_FILE: Partial<Diff> = {
  chunks: [],
};

type DiffPlaceholderProps = {
  lines: number;
  chunks: number;
  file?: Diff;
  conversations?: any[];
  isOpen?: boolean;
};

const DiffPlaceholder = (props: DiffPlaceholderProps) => {
  const { conversationProvider } = useContext(ConversationsContext);

  const {
    lines,
    chunks,
    file = DEFAULT_FILE,
    conversations,
    isOpen,
    ...extraProps
  } = props;

  const filepath = file.to === '/dev/null' ? file.from : file.to;
  let numberOfComments = 0;
  let indexableCommentsAndAuthors: any[] = [];

  if (isOpen) {
    indexableCommentsAndAuthors = (conversations || []).map(convo => {
      const convoId = convo.conversationId;
      const fullConversation = conversationProvider.getConversation(convoId);

      const extractedAuthorAndText = get(fullConversation, 'comments', []).map(
        // @ts-ignore TODO: fix noImplicitAny error here
        comment => {
          numberOfComments++;
          const adfDoc = get(comment, 'document.adf', {});
          const authorName = comment.createdBy.name;
          return `${authorName} ${renderDocument(adfDoc, serializer).result}`;
        }
      );

      return extractedAuthorAndText;
    });
  }

  return (
    <PlaceholderWrapper
      lines={lines}
      chunks={chunks}
      conversations={(conversations || []).length}
      comments={numberOfComments}
      isOpen={isOpen}
      {...extraProps}
      data-qa="pr-diff-placeholder-wrapper"
    >
      {isOpen ? (
        <Fragment>
          <h2 style={placeholderHeader}>{filepath}</h2>
          {(file.chunks || []).map(chunk =>
            chunk.changes.map(
              change =>
                `\n${change.oldLine || ''},${change.newLine || ''} ${
                  change.content
                }`
            )
          )}
        </Fragment>
      ) : (
        <span style={{ margin: 'auto 0', paddingLeft: `${gridSize()}px` }}>
          <Spinner size="xsmall" />
        </span>
      )}
      {indexableCommentsAndAuthors}
    </PlaceholderWrapper>
  );
};

DiffPlaceholder.defaultProps = {
  isOpen: true,
};

export default React.memo(DiffPlaceholder);
