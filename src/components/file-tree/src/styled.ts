import styled from '@emotion/styled';
import { css as emotion } from '@emotion/core';
import {
  colors,
  fontSize,
  gridSize,
  borderRadius,
  typography,
} from '@atlaskit/theme';

const fileActiveColor = colors.B50;
const fileHoveredColor = colors.N20;
const GRID_SIZE = gridSize();
const CELL_WIDTH = gridSize() / 2;
const FILES_INDENTATION = gridSize() * 2;

// AK Tooltip inserts an empty div and we need to target it
// to properly add ellipsis to the file name
export const TooltipWrapper = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  > div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const Directory = styled.div`
  user-select: none;
`;

export const DirectoryContent = styled.div`
  margin-left: ${FILES_INDENTATION}px;
`;

export const DirectoryHeader = styled.button`
  border: 0;
  background: none;
  display: flex;
  align-items: center;
  margin-left: ${CELL_WIDTH}px;
  padding: ${GRID_SIZE * (3 / 4)}px 0;
  font-size: ${fontSize()}px;
  cursor: pointer;
  color: inherit;

  &:hover,
  &:focus {
    text-decoration: none;
    color: inherit;
  }

  > div:last-of-type {
    display: flex;
    flex-shrink: 0;
    overflow: hidden;
  }
`;

export const DirectoryFolder = styled.div`
  width: ${GRID_SIZE * 2}px;
`;

/* remove this disable once https://github.com/YozhikM/stylelint-a11y/issues/38 is addressed */
/* stylelint-disable a11y/media-prefers-reduced-motion */
export const File = styled.a<{ isActive: boolean }>`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  padding: 6px ${CELL_WIDTH}px 6px;
  background-color: ${({ isActive }) =>
    isActive ? fileActiveColor : 'transparent'};
  border-radius: ${borderRadius()}px;
  color: inherit;
  font-size: ${fontSize()}px;
  cursor: pointer;
  transition: all 0.2s ease-out;
  text-decoration: none;
  height: 20px;

  &:hover,
  &:focus {
    background-color: ${fileHoveredColor};
    color: inherit;
    transition: all 0.2s ease-in;
    text-decoration: none;
  }

  @media screen and (prefers-reduced-motion: reduce) {
    /* https://css-tricks.com/revisiting-prefers-reduced-motion-the-reduced-motion-media-query/ */
    transition-duration: 0.001ms;

    &:hover,
    &:focus {
      transition-duration: 0.001ms;
    }
  }

  > div:last-of-type {
    display: flex;
    flex-shrink: 0;
    overflow: hidden;
  }
`;
/* stylelint-enable */

export const FileNotes = styled.div`
  margin-left: auto;
  height: 100%;
  align-items: center;
`;

export const FileName = styled.span`
  margin-left: ${GRID_SIZE}px;
`;

export const CommentsWrapper = styled.span<{ label: string }>`
  display: flex;
  align-items: center;
  margin-left: ${GRID_SIZE}px;
  height: 100%;

  /* !! Hacky overrides for AK Icons that don't support our needs !! */
  & svg,
  & [aria-label="${({ label }) => label}"] {
    vertical-align: unset;
    height: 12px;
    width: 12px;
  }
`;

const FileNotesTypography = emotion`
  ${typography.h200() as any};
  margin-top: 0;
  color: initial;
`;

export const CommentsNumber = styled.span`
  ${FileNotesTypography}
  margin-left: ${GRID_SIZE / 2}px;
  font-weight: normal;
`;

export const LinesAdded = styled.span`
  ${FileNotesTypography}
  color: ${colors.G500};

  /* left margin only if this is next to a comments count */
  ${CommentsWrapper as any} ~ & {
    margin-left: ${GRID_SIZE}px;
  }
  `;

export const LinesRemoved = styled.span`
  ${FileNotesTypography}
  color: ${colors.R500};

  /* left margin only if this is next to a LinesAdded or CommentsWrapper */
  ${LinesAdded} ~ &,
  ${/* sc-selector */ CommentsWrapper} ~ & {
    margin-left: ${GRID_SIZE}px;
  }
`;
