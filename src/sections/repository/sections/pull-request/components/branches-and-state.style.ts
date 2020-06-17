import styled from '@emotion/styled';
import { colors, borderRadius, gridSize } from '@atlaskit/theme';
import { media } from '@atlassian/bitkit-responsive';

export const BranchesAndState = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  ${media.upToXLarge(`flex-wrap: wrap;`)}
`;

const originalTagMaxWidth = '180';

export const BranchLabel = styled.span`
  background: ${colors.N20};
  border-radius: ${borderRadius()}px;
  color: ${colors.N500};
  cursor: default;
  display: inline-block;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  max-width: ${originalTagMaxWidth}px;
  overflow: hidden;
  padding: ${gridSize() / 2}px ${gridSize()}px;
  text-overflow: ellipsis;
  vertical-align: middle;
  white-space: nowrap;
`;

export const ItemWrapper = styled.div`
  margin-right: ${gridSize() / 2}px;
`;
