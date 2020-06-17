import { gridSize } from '@atlaskit/theme';
import styled from '@emotion/styled';

export const Icon = styled.div<{ backgroundColor: string }>`
  width: ${gridSize() * 4}px;
  height: ${gridSize() * 4}px;
  background-color: ${props => props.backgroundColor};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
