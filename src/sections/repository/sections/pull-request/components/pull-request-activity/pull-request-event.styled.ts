import styled from '@emotion/styled';
import { codeFontFamily, gridSize, colors } from '@atlaskit/theme';

export const RightToLeftContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
`;

export const CommitText = styled.span`
  font-family: ${codeFontFamily()};
`;
export const MessageText = styled.span`
  margin: 0 0 0 ${gridSize() / 2}px;
`;

export const CommentContext = styled.span`
  margin-left: ${gridSize() / 2}px;
`;

export const DeletedFile = styled.span`
  text-decoration: line-through;
`;

export const CommentSnippet = styled.blockquote`
  color: ${colors.N200};
  padding-left: ${gridSize()}px;
  margin: ${gridSize() / 2}px 0;
  border-left: ${gridSize() / 4}px solid ${colors.N40};
  opacity: 0.7; /* Used for new comment snippets since they wrap an AKRenderer */

  &::before,
  &::after {
    content: none;
  }
`;
