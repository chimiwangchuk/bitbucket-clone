import { gridSize } from '@atlaskit/theme';
import styled from '@emotion/styled';

export const Card = styled.div`
  & + & {
    margin-top: ${gridSize() * 1.5}px;
  }
`;
