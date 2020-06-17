import { borderRadius, colors, gridSize, layers } from '@atlaskit/theme';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

/*
  z-index is set as such so that the [...] menu in the sticky header
  appears on top of the file header component (@atlassian/bitkit-file).
  Multiples of 10 have been used to allow for some wiggle room for
  future use if we need to tweak the layers. Even though the dropdown
  has a higher z-index than the sticky header, this works because by
  giving the file header `position:sticky`, it resets the stacking
  context, so the menu still goes underneath the sticky header.

  The stacking order is as follows using layers from @atlaskit/theme:

  Dropdown (layer() = z-index: 400
  |
  Sticky Header (navigation()+n = z-index: 220)
  |
  File Header
    dropdown closed: navigation()-n = z-index: 180
    dropdown open: navigation()-n+1 = z-index: 181

  note: subtracting 20 from navigation() so the sticky file headers
  go beneath AK Nav & blankets when mobile header is active

  note(2): AK changed the source of truth values for layers.navigation :(
  https://bitbucket.org/atlassian/atlaskit-mk-2/diff/packages/core/theme/src/constants.js?at=master&diff1=19a12541866d6444b97dec408c3c6efd5f5fbc8f&diff2=74e0f5c5708cf6db0daafa5aedf1c25f7f0da1f0
*/
const fileHeaderStackingIndex = layers.navigation() - 20;
const fileHeaderStackingIndexWhenActive = fileHeaderStackingIndex + 1;
/* prettier-ignore */
export const FileHeader = styled.div<{
  isExpanded?: boolean,
  isCollapsible?: boolean,
  hasStickyHeader?: boolean,
  stickyHeaderOffset?: number,
  isDropdownMenuOpen?: boolean,
}>`
  align-items: center;
  background: ${colors.N20};
  border: 1px solid ${colors.N40};
  border-radius: ${({ isExpanded }) =>
    isExpanded
      ? `${`${borderRadius()}px`} ${`${borderRadius()}px`} 0 0`
      : `${borderRadius()}px`};
  box-sizing: border-box;
  cursor: ${({ isCollapsible }) => (isCollapsible ? 'pointer' : 'auto')};
  display: flex;
  flex-wrap: wrap;
  min-height: ${gridSize() * 5}px;
  padding: ${gridSize() / 2}px ${gridSize()}px;
  ${({ hasStickyHeader }) => hasStickyHeader && `position: sticky;`}
  ${({ stickyHeaderOffset }) => stickyHeaderOffset && stickyHeaderOffset >= 0 && `top: ${stickyHeaderOffset}px;`}
  z-index: ${({ isDropdownMenuOpen }) =>
    isDropdownMenuOpen
      ? `${fileHeaderStackingIndexWhenActive}`
      : `${fileHeaderStackingIndex}`};
  outline: 0;

  &:focus {
    border: 2px solid ${colors.B100};
  }
`;

export const FileContent = styled.div`
  border: solid ${colors.N40};
  border-width: 0 1px 1px;
  border-radius: 0 0 ${`${borderRadius()}px`} ${`${borderRadius()}px`};
  box-sizing: border-box;
`;

export const IconWrapper = styled.div`
  flex: none;
  line-height: 0;
  margin-left: ${gridSize() / 2}px;
`;

/* remove this disable once https://github.com/YozhikM/stylelint-a11y/issues/38 is addressed */
/* stylelint-disable a11y/media-prefers-reduced-motion */
export const ChevronWrapper = styled(IconWrapper)<{
  isExpanded?: boolean;
}>`
  align-self: center;
  transform: rotate(${({ isExpanded }) => (isExpanded ? 0 : -90)}deg);
  transition: all 0.15s ease;
  margin-left: 0;

  @media screen and (prefers-reduced-motion: reduce) {
    /* https://css-tricks.com/revisiting-prefers-reduced-motion-the-reduced-motion-media-query/ */
    transition-duration: 0.001ms;
  }
`;
/* stylelint-enable */

export const FileButtons = styled.div`
  display: inline-block;
  margin: 0 ${gridSize()}px;
`;

export const FileMenu = styled.div`
  flex: none;
`;

/* reset Atlaskit H2 styles */
const resetHeadingStyle = css`
  font-size: inherit;
  line-height: inherit;
  color: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
  margin: 0;
  padding: 0;
`;

/* a11y: use h2 (semantic HTML) so that screen reader users can jump to diffs via headings */
export const FilePath = styled.h2`
  ${resetHeadingStyle}
  word-break: break-word;
  cursor: auto;
  display: flex;
  flex-wrap: wrap;
`;

export const FilePathWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: ${gridSize() * 20}px;
  margin-left: ${gridSize()}px;
`;

export const HighlightLastWord = styled.div`
  span:last-child {
    font-weight: 600;
  }
`;

export const Highlight = styled.div`
  font-weight: 600;
`;

export const ArrowContainer = styled.div`
  margin-left: ${gridSize() / 2}px;
  margin-right: -${gridSize() / 4}px;
  height: ${gridSize() / 2}px;
  padding-top: ${gridSize() / 4}px;
`;

export const AfterFilePath = styled.div`
  padding-left: ${gridSize() * 2}px;
  margin-right: auto;
`;

export const BeforeActions = styled(AfterFilePath)`
  margin-right: 0;
`;

export const PaddedSegment = styled.span<{
  spacing: string;
}>`
  margin-left: ${({ spacing }) => spacing};
`;

export const FileActions = styled.div`
  align-items: flex-start;
  display: flex;
  flex: none;
  padding-left: ${gridSize()}px;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;
