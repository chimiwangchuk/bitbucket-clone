// Originally taken from: https://bitbucket.org/atlassian/atlaskit-mk-2/src/master/packages/core/onboarding/src/styled/Dialog.js

import styled from '@emotion/styled';
import { colors, gridSize, math } from '@atlaskit/theme';

export const FillScreen = styled.div<{ scrollDistance: string }>`
  height: 100%;
  left: 0;
  overflow-y: auto;
  position: absolute;
  top: ${p => p.scrollDistance}px;
  width: 100%;
`;

// Bitbucket override to better align with ADG3
export const Description = styled.p`
  line-height: ${math.multiply(gridSize, 3)}px;
`;

export const Link = styled.a`
  color: ${colors.N0};
  text-decoration: underline;
  &:hover,
  &:active,
  &:visited,
  &:focus {
    color: ${colors.N0};
    text-decoration: underline;
  }
`;

// internal elements
export const Image = styled.img`
  height: auto;
  max-width: 100%;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const ActionItems = styled.div`
  display: flex;
  margin: 0 -${math.divide(gridSize, 2)}px;
`;

export const ActionItem = styled.div`
  margin: 0 ${math.divide(gridSize, 2)}px;
`;

export const HeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${gridSize()}px;
`;
