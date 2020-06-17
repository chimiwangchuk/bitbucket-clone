import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme';

export const WorkspaceSelectorOption = styled.div`
  display: flex;
  align-items: center;
  padding: 0 ${gridSize() / 2}px;

  > :first-child {
    margin-right: ${gridSize() / 2}px;
  }
`;
