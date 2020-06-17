import styled from '@emotion/styled';
import { gridSize, colors } from '@atlaskit/theme';

const { N500: textColor } = colors;

export const ErrorPage = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  color: ${textColor};
`;

export const Center = styled.div`
  text-align: center;
`;

export const TryAgainButton = styled.div`
  margin-top: ${gridSize() * 4}px;
`;

export const ErrorImage = styled.div`
  width: ${gridSize() * 10}px;
  margin: auto;
`;
