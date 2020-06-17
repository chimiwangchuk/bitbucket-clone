import styled from '@emotion/styled';
import { gridSize, colors } from '@atlaskit/theme';

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
`;

export const CommitListWrapper = styled.div`
  border-top: ${gridSize() / 4}px solid ${colors.N40};
  border-bottom: ${gridSize() / 4}px solid ${colors.N40};
`;

export const PanelHeaderWrapper = styled.div`
  display: flex;
`;

export const BranchSyncInfoWrapper = styled.div`
  margin-left: ${gridSize()}px;
`;
