import styled from '@emotion/styled';
import { colors, gridSize, borderRadius } from '@atlaskit/theme';

// AkTheme doesn't have a small font size var
const smallFont = 12;

export const WhatsNewIntro = styled.p`
  white-space: normal;
  margin-top: 0;
  padding-top: 6px;
  color: ${colors.N100};
  line-height: 1.3;
  font-size: ${smallFont}px;
  margin-bottom: ${gridSize()}px;
`;

export const Card = styled.div`
  background-color: ${colors.N20};
  padding: ${gridSize()}px;
  margin: ${gridSize()}px;
  border-radius: ${borderRadius()}px;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Date = styled.span`
  font-size: ${smallFont}px;
  color: ${colors.N300};
`;

export const CardInner = styled.div`
  padding: ${gridSize()}px;
  background-color: white;
  border-radius: ${borderRadius()}px;
  margin-top: ${gridSize()}px;
  box-shadow: 0 0 1px 0 ${colors.N50A};
`;

export const CardTitle = styled.span`
  font-size: 16px;
  color: ${colors.N800};
`;

export const LearnMoreLink = styled.a`
  color: ${colors.B400};
  font-size: ${smallFont}px;
`;
