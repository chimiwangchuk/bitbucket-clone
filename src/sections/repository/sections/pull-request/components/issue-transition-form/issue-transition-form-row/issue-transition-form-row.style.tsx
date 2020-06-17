import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme';

export const LineContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const SelectContainer = styled.div`
  padding-right: ${gridSize() / 4}px;
  padding-left: ${gridSize() / 4}px;
  flex-shrink: 0;
`;
