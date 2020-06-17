import {
  colors,
  typography,
  borderRadius,
  gridSize,
  fontFamily,
  fontSize,
} from '@atlaskit/theme';
import styled from '@emotion/styled';
import { overflowEllipsis } from 'src/styles/mixins';

export const IssueCardLink = styled.a`
  display: flex;
  color: inherit;
  text-decoration: inherit;
  flex-direction: column;
  justify-content: space-between;
  padding: ${gridSize() * 1.5}px;
  position: relative;
  height: ${gridSize() * 7}px;
  margin-bottom: ${gridSize()}px;
  background: ${colors.N0};
  box-shadow: 0 0 ${gridSize() / 8}px ${colors.N50},
    0 ${gridSize() / 8}px ${gridSize() / 8}px ${colors.N50};
  border-radius: ${borderRadius()}px;

  &:hover,
  &:active,
  &:focus {
    background-color: ${colors.N20};
    color: inherit;
    text-decoration: inherit;
  }
  cursor: pointer;
`;

export const BottomContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const BottomLeftContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const BottomRightContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const DoneIconContainer = styled.div`
  margin-right: ${gridSize() / 2}px;
  margin-bottom: ${gridSize() / 2}px;
`;

export const SummaryTextContainer = styled.div`
  height: ${gridSize() * 3}px;
  ${overflowEllipsis()};
  font-family: ${fontFamily()};
  font-size: ${fontSize()};
`;

export const IssueKeyContainer = styled.span`
  ${typography.h200() as any};
  color: ${colors.N100};
  margin-top: 0;
  margin-left: ${gridSize()}px;
`;
