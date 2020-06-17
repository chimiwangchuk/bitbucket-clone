import { gridSize } from '@atlaskit/theme';
import styled from '@emotion/styled';

import { media } from '@atlassian/bitkit-responsive';

export const Section = styled.div`
  margin-bottom: ${gridSize() * 4}px;
`;

export const PaginationContainer = styled.div`
  padding: ${gridSize()}px 0;
`;

export const SortButton = styled.div`
  ${media.upToMedium(' display: none; ')}
`;
