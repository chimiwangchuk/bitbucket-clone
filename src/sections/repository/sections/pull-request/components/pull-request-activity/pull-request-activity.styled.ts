import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme';

export const LoadMoreActivityWrapper = styled.div`
  padding-bottom: ${gridSize() / 2}px;
  padding-top: ${gridSize()}px;
  text-align: center;
`;

export const Spinner = styled.div`
  text-align: center;
`;

export const EmptyState = styled.p`
  padding: ${1.75 * gridSize()}px;
  width: ${25 * gridSize()}px;
  margin: 0 auto;
  text-align: center;
`;
