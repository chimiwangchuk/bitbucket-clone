import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme';

export const CustomizedErrorStateWrapper = styled.section`
  text-align: center;
  padding: ${gridSize() * 16}px 0;
`;

export const CustomizedErrorStateLogo = styled.img`
  width: ${gridSize() * 25}px;
  height: ${gridSize() * 25}px;
`;

export const CustomizedErrorStateTitle = styled.h1`
  margin: ${gridSize() * 2}px 0 ${gridSize() * 1.5}px;
`;
