import styled from '@emotion/styled';
import { colors, gridSize } from '@atlaskit/theme';

export const PipelinesPromotionIcon = styled.img`
  margin: 12px auto 22px auto;
  display: block;
  height: 100px;
`;

export const PipelinesPromotionRow = styled.p`
  margin-bottom: ${gridSize};
  text-align: left;
  padding: 0 ${gridSize() / 2}px;
`;

export const PipelinesPromotionLink = styled.p`
  margin-top: ${gridSize() * 2}px;
  text-align: center;
  border-top: 1px solid ${colors.N40A};
  padding: ${gridSize()}px;
`;
