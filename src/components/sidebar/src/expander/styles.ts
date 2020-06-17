import { borderRadius, colors, gridSize, fontSize } from '@atlaskit/theme';

import styled from '@emotion/styled';

const backgroundColor = colors.N0;
const hoverBorderColor = colors.B200;
const dividerColor = colors.N30;
const warningIconColor = colors.Y300;

export const Panel = styled.section`
  background-color: ${backgroundColor};
  border-radius: ${borderRadius()}px;
  text-align: left;
`;

export const PanelHeading = styled.button<{
  isCollapsed: boolean;
  isExpandable: boolean;
}>`
  align-items: center;
  background-color: ${backgroundColor};
  border: 0 none transparent;
  border-bottom: 1px solid ${dividerColor};
  border-radius: ${({ isCollapsed }) =>
    isCollapsed
      ? `${borderRadius()}px`
      : `${borderRadius()}px ${borderRadius()}px 0 0`};
  box-sizing: border-box;
  color: inherit; /* needed to prevent Safari setting to "activebuttontext" (white) */
  cursor: ${({ isExpandable }) => (isExpandable ? 'pointer' : 'inherit')};
  display: flex;
  flex-wrap: wrap;
  min-height: ${gridSize() * 5}px;
  padding: ${gridSize()}px;
  position: sticky;
  top: 0;
  z-index: 1; /* Stop avatars from hovering over this sticky heading */
  text-align: left;
  font-size: ${fontSize()}px;
  width: 100%;
  outline: none;
  line-height: inherit;

  &:hover {
    box-shadow: ${({ isCollapsed, isExpandable }) =>
      isExpandable && isCollapsed ? `0 0 0 1px ${hoverBorderColor}` : 'none'};
  }

  &:focus,
  &:active {
    box-shadow: ${({ isExpandable }) =>
      isExpandable ? `0 0 0 1px ${hoverBorderColor}` : 'none'};
  }
`;

export const PanelHeadingLabel = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

type PanelBodyProps = {
  isOverflowVisible?: boolean;
};

export const PanelBody = styled.div`
  border-radius: 0 0 ${borderRadius()}px ${borderRadius()}px;
  flex-flow: column;
  overflow: ${({ isOverflowVisible }: PanelBodyProps) =>
    isOverflowVisible ? 'visible' : 'hidden'};
  padding: ${gridSize()}px;
`;

export const Icon = styled.span`
  display: flex;
  margin-right: 4px;
`;

// allows for caller to pass in an AK Icon or
// an AK Tooltip wrapped one with any tag name specified
export const IconSecondary = styled.div`
  display: flex;
  > * {
    display: flex;
  }
`;

export const Chevron = styled.span`
  display: flex;
  margin-left: auto;
`;

export const Spinner = styled.div`
  & > div {
    display: flex;
  }
`;

export const WarningWrapper = styled.span`
  color: ${warningIconColor};
  display: flex;

  button {
    display: flex;
  }
`;
