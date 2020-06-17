// @ts-ignore TODO: fix noImplicitAny error here
import Item from '@atlaskit/item';
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme';

export const StyledItem = styled(Item)<any>`
  height: ${gridSize() * 5}px;
`;
