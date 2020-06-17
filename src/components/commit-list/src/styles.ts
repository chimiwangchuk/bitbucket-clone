import styled from '@emotion/styled';
import { gridSize, codeFontFamily, colors } from '@atlaskit/theme';
import { media } from '@atlassian/bitkit-responsive';

import {
  TableHeader,
  ColumnDefinitionMobileHidden,
} from '@atlassian/bitbucket-pageable-table';

const FIX_OUTLINE_SHIFT = gridSize() / 2;

export const CommitsContainer = styled.div<{ isDisabled: boolean }>`
  position: relative;
  width: 100%;
  ${({ isDisabled }) =>
    isDisabled ? 'pointer-events: none; user-select: none' : null};
`;

export const CommitsWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

export const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const AuthorName = styled.div`
  margin-left: ${gridSize() * 2}px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${media.upToMedium(`
    display: none;
  `)}
`;

export const AuthorColumnDefinition = styled(ColumnDefinitionMobileHidden)`
  width: ${gridSize() * 27}px;
  ${media.upToMedium(`
    width: ${gridSize() * 4.5}px;
  `)}
`;

export const CommitHashColumnDefinition = styled(ColumnDefinitionMobileHidden)`
  width: ${gridSize() * 12.5}px;
`;

export const CommentsColumnDefinition = styled(ColumnDefinitionMobileHidden)`
  width: ${gridSize() * 8}px;
`;

export const DateColumnDefinition = styled(ColumnDefinitionMobileHidden)`
  width: ${gridSize() * 15}px;
`;

export const BuildsColumnDefinition = styled.col`
  width: ${gridSize() * 8}px;
`;

export const BuildsTableHeader = styled(TableHeader)`
  text-align: center;
`;

export const BuildStatusWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const CommitSelectorColumnDefinition = styled.col`
  width: ${gridSize() * 4}px;
`;

export const CommitHashWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const CommitHash = styled.span`
  font-family: ${codeFontFamily()};
`;

export const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  ${media.upToLarge(`
    flex-wrap: wrap;
  `)}
`;

export const CommitInfo = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  justify-content: center;
  ${media.upToSmall(`
    justify-content: flex-start;
  `)}
`;

export const CommitMessage = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-grow: 1;
  line-height: 2;
  padding-left: ${FIX_OUTLINE_SHIFT}px;

  img {
    max-height: 1em;
    font-size: inherit;
  }

  ${media.upToMedium(`
    padding-left: 0;
  `)}

  ${media.upToLarge(`
    flex-shrink: 1;
    flex-basis: 60%;
  `)}
`;

export const CommitMessageHeaderWrapper = styled.div`
  padding-left: ${FIX_OUTLINE_SHIFT}px;
  ${media.upToMedium(`
    padding-left: 0;
  `)}
`;

export const ShowMoreBtnContainer = styled.div`
  width: 100%;
`;

export const CommitSelectorOption = styled.tr<{
  hasPointerCursor: boolean;
  isFocused?: boolean;
  isMergeCommit?: boolean;
}>`
  ${({ hasPointerCursor }) => (hasPointerCursor ? 'cursor: pointer' : null)};
  ${({ isFocused }) => (isFocused ? `background-color: ${colors.N20}` : null)};
  ${({ isMergeCommit }) => (isMergeCommit ? 'opacity: 0.7' : null)};
`;

// line-height: 28px / default font size of 14px, same height as avatar + padding
export const SeeAllCommitsOption = styled.span`
  line-height: 2;
  display: inline-block;
`;

export const CommitLabel = styled.div`
  cursor: default;
`;

export const SummaryInfo = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: none;
  font-size: 12px;
  ${media.upToSmall(`
    display: block;
  `)}
`;

export const CommentIconWrapper = styled.div`
  display: flex;
  margin-right: ${gridSize() * 0.5}px;
`;

export const Byline = styled.small`
  /* Prevents text upscale for small and wide elements in mobile Safari, Edge and Chrome */
  text-size-adjust: none;
`;
