import { gridSize } from '@atlaskit/theme';
import styled from '@emotion/styled';

export const Container = styled.small`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
`;

export const Spinner = styled.div`
  margin: ${gridSize()}px 0;
`;
