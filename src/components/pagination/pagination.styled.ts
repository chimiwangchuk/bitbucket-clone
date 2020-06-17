import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme';

export const Pagination = styled.div`
  > div {
    justify-content: center;
  }

  margin-top: ${gridSize() * 3}px;
  margin-bottom: ${gridSize() * 3}px;
`;

export const PaginationWrapper = styled.div`
  margin-bottom: ${gridSize() * 2}px;
`;
