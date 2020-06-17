import { borderRadius, colors, gridSize } from '@atlaskit/theme';

import styled from '@emotion/styled';

const backgroundColor = colors.N0;
export const dividerColor = colors.N30;

export const Panel = styled.div<{ isCollapsed?: boolean }>`
  background-color: ${backgroundColor};
  border-radius: ${borderRadius()}px;
  text-align: left;
  margin: 0 ${gridSize() * 1.5}px;
`;

export const PanelHeading = styled.div<{ isCollapsed: boolean }>`
  align-items: center;
  background-color: ${backgroundColor};
  border: none;
  border-bottom: 1px solid ${dividerColor};
  border-radius: ${({ isCollapsed }) =>
    isCollapsed
      ? `${borderRadius()}px`
      : `${borderRadius()}px ${borderRadius()}px 0 0`};
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  height: ${gridSize() * 5}px;
  padding: 0 ${gridSize()}px;
  position: sticky;
  top: 0;

  &:hover,
  &:focus {
    box-shadow: ${({ isCollapsed }) =>
      isCollapsed ? `0 0 0 1px ${colors.B200}` : 'none'};
  }
`;

export const PanelHeadingLabel = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
`;

export const PanelBody = styled.div`
  border-radius: 0 0 ${borderRadius()}px ${borderRadius()}px;
  flex-flow: column;
  overflow: hidden;
  padding: ${gridSize()}px;
`;

export const Icon = styled.span`
  display: flex;
  margin-right: 4px;
`;
