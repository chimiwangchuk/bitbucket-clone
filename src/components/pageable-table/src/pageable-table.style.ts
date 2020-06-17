import { colors, gridSize } from '@atlaskit/theme';

import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { media } from '@atlassian/bitkit-responsive';

export const Table = styled.table<{ isLoading?: boolean }>`
  table-layout: fixed;
  width: 100%;
  pointer-events: ${props => (props.isLoading ? 'none' : 'auto')};

  /* Atlaskit adds a top margin to tables by default and sets it to 0 with :first-child.
     When we have the loading cover, the table is no longer the first child so the margin comes back.
     We don't want that, so remove the margin altogether here.
   */
  margin-top: 0;
`;

export const TableBody = styled.tbody<{ showHeaders: boolean }>`
  ${props =>
    !props.showHeaders &&
    css`
      border-width: 0;
    `};
`;

export const Container = styled.div`
  position: relative;
  width: 100%;
`;

export const TableHeader = styled.th<{ centered?: boolean; width?: number }>`
  color: ${colors.N300};
  vertical-align: middle;
  text-align: ${({ centered }) => (centered ? 'center' : 'initial')};
  padding: ${gridSize() / 2}px ${gridSize()}px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${({ width }) => (width ? `width: ${width}%;` : null)}

  &:first-child {
    padding-left: 0;
  }
`;

export const TableHeaderMobileOnly = styled(TableHeader)`
  display: none;
  ${media.upToSmall(`
    display: table-cell;
  `)}
`;

export const TableHeaderMobileHidden = styled(TableHeader)`
  ${media.upToSmall(`
    display: none;
  `)}
`;

export const TableCell = styled.td<{ centered?: boolean }>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: ${gridSize() * 5}px;
  box-sizing: border-box;
  text-align: ${({ centered }) => (centered ? 'center' : 'initial')};
`;

export const TableCellMobileOnly = styled(TableCell)`
  display: none;
  ${media.upToSmall(`
    display: table-cell;
  `)}
`;

export const TableCellMobileHidden = styled(TableCell)`
  ${media.upToSmall(`
    display: none;
  `)}
`;

export const RightAlignedTableCell = styled(TableCell)`
  text-align: right;
`;

export const ColumnDefinitionMobileHidden = styled.col`
  ${media.upToSmall(`
    display: none;
  `)}
`;

export const ColumnDefinitionDesktopOnly = styled.col`
  ${media.upToLarge(`
    display: none;
  `)}
`;

export const BylineSection = styled.div`
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  ${media.upToSmall(`
    margin-right: ${gridSize()}px;
  `)}

  & + & {
    &::before {
      content: '·';
      margin: 0 ${gridSize()}px;
      ${media.upToSmall(`
        display: none;
      `)}
    }
  }
`;

export const TabletByline = styled.div`
  display: none;
  margin-left: ${gridSize()}px;
  font-size: 0.9em;
  color: ${colors.N200};
  ${media.upToLarge(`
    display: block;
  `)}
`;
