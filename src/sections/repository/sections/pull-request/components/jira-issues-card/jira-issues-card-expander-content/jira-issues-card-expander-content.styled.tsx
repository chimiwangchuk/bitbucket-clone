import {
  gridSize,
  fontFamily,
  fontSize,
  colors,
  typography,
} from '@atlaskit/theme';
import styled from '@emotion/styled';
import Button from '@atlaskit/button';

export const ExpanderContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: ${gridSize() / 4}px;
  padding-right: ${gridSize() / 4}px;
`;

export const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const EmptyStateImage = styled.img`
  margin-top: ${gridSize() * 2}px;
`;

export const EmptyStateHeadingText = styled.div`
  ${typography.h400() as any};
  margin-bottom: ${gridSize() * 2}px;
`;

export const EmptyStateBodyText = styled.div`
  font-family: ${fontFamily()};
  font-size: ${fontSize()}px;
  margin-bottom: ${gridSize() * 2}px;
  width: ${gridSize() * 22}px;
  text-align: center;
`;

export const EmptyStateButton = styled(Button)`
  margin-bottom: ${gridSize() * 2}px;
`;

export const ShowMoreButton = styled.button`
  border-style: none;
  margin-top: ${gridSize()}px;
  margin-bottom: ${gridSize()}px;
  padding: 0;
  height: ${gridSize() * 3}px;
`;

export const ShowHideButton = styled.button`
  border-style: none;
  padding: 0;
  height: ${gridSize() * 2}px;
`;

export const CreatedInPrContainerLargeTopMargin = styled.div`
  margin-top: ${gridSize() * 3}px;
`;

export const CreatedInPrContainerSmallTopMargin = styled.div`
  margin-top: ${gridSize() * 0.5}px;
`;

export const CreatedInPrHeadingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: ${gridSize()}px;
  margin-bottom: ${gridSize()}px;
  margin-right: ${gridSize()}px;
`;

export const ShowMoreTextContainer = styled.div`
  font-family: ${fontFamily()};
  font-size: ${fontSize()}px;
  color: ${colors.B400};
`;

export const ShowHideTextContainer = styled.div`
  font-family: ${fontFamily()};
  font-size: 11px;
  color: ${colors.N100};
`;

export const CreatedInPrTextContainer = styled.div`
  display: flex;
  align-items: center;
  ${typography.h200() as any};
  color: ${colors.N100};
  text-transform: uppercase;
  margin-top: 0;
`;

export const Divider = styled.div`
  height: 1px;
  background-color: ${colors.N30};
  margin-top: ${gridSize()}px;
  margin-left: -${gridSize() * 1.25}px;
  margin-right: -${gridSize() * 1.25}px;
`;
