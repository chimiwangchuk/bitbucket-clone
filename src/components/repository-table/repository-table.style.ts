import { gridSize } from '@atlaskit/theme';
import styled from '@emotion/styled';

export const Container = styled.div<{ isLoading?: boolean }>`
  position: relative;
  min-height: 100px;
  padding-top: ${gridSize()}px;
  pointer-events: ${props => (props.isLoading ? 'none' : 'auto')};
`;

export const MessageCol = styled.td`
  text-align: center;
  padding: ${gridSize() * 3}px;
`;

export const ControlContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  font-weight: normal;
  margin-right: ${gridSize() * -1}px;
`;
