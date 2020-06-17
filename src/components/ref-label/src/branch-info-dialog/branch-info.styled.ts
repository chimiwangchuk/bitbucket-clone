import { gridSize, typography } from '@atlaskit/theme';
import styled from '@emotion/styled';

export const BranchInfo = styled.table`
  margin-bottom: ${gridSize() * 2}px;
`;

export const TableBody = styled.tbody`
  border-width: 0;
`;

export const TableLeftColumn = styled.td`
  text-align: right;
  ${typography.h200() as any};
  padding-right: 0;
`;

export const TableRightColumn = styled.td`
  max-width: ${gridSize() * 51}px;
`;

// Attempt to match the styles of an AK Button with `appearance="link"` and an icon
export const FormerUser = styled.span`
  align-items: center;
  display: flex;
  padding: ${gridSize() / 2}px ${gridSize()}px;
`;

export const FormerUserAvatar = styled.span`
  /* remove phantom padding from AK avatar to center-align vertically */
  line-height: 0;
  margin: 0 ${gridSize() / 2}px;
`;

export const FormerUserName = styled.span`
  margin: 0 ${gridSize() / 2}px;
`;
