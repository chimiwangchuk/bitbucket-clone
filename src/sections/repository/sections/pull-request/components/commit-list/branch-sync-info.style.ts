import styled from '@emotion/styled';
import { gridSize, colors } from '@atlaskit/theme';

export const BranchSyncInlineContainer = styled.span`
  display: flex;
  align-items: center;
  height: ${gridSize() * 2.5}px;
`;

export const BranchSyncBlockContainer = styled.div`
  height: ${gridSize() * 4}px;
  background: ${colors.B50};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const InfoIconWrapper = styled.span`
  margin-right: ${gridSize() / 2}px;
  margin-top: ${gridSize() / 4}px;
`;

export const ActionWrapper = styled.div`
  margin-left: -${gridSize()}px;
`;
