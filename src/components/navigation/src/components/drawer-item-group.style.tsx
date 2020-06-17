import { fontSize, gridSize } from '@atlaskit/theme';
import styled from '@emotion/styled';

export const ItemGroupWrapper = styled.div`
  padding-top: ${gridSize() * 2}px;
`;

export const ItemChildrenWrapper = styled.div`
  margin: 0 ${gridSize()}px;
`;

export const TitleWrapper = styled.div`
  line-height: ${(gridSize() * 2) / fontSize()};
  font-weight: 600;
`;
