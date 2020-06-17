import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme';

import { CenteredColumn } from 'src/styles';

export const EmptyResults = styled(CenteredColumn)`
  margin-top: ${gridSize() * 4}px;
`;

export const EmptyResultsInfo = styled.div`
  margin-top: ${gridSize()}px;

  text-align: center;
`;

export const NoWrapContainer = styled.span`
  white-space: nowrap;
`;
