import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme';

export const ActionsList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin-top: ${gridSize() * 1.5}px;

  li {
    display: inline-block;

    &:not(:first-child) {
      margin-left: ${gridSize() * 0.5}px;

      &::before {
        content: '\xb7';
        margin-right: ${gridSize() * 0.5}px;
      }
    }
  }
`;
