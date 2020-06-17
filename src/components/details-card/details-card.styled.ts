import { gridSize, typography } from '@atlaskit/theme';
import styled from '@emotion/styled';

import { overflowEllipsis } from 'src/styles/mixins';

export const Row = styled.div`
  display: flex;
  margin-bottom: ${gridSize() * 2}px;
`;

export const Column = styled.div`
  flex: 1;
  min-width: 0;
  padding: 0 ${gridSize()}px;

  &:first-child {
    padding-left: 0;
  }

  &:last-child {
    padding-right: 0;
  }
`;

export const Label = styled.div`
  ${typography.h200() as any};
  margin-top: 0;
`;

export const Value = styled.div`
  ${overflowEllipsis()};
`;

export const Card = styled.div`
  & + & {
    margin-top: ${gridSize() * 1.5}px;
  }
`;
