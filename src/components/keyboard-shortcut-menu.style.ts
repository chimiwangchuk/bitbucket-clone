import { colors, gridSize, borderRadius } from '@atlaskit/theme';

import styled from '@emotion/styled';

export const ShortcutGroup = styled.div`
  margin-bottom: ${gridSize() * 2}px;
`;

export const GroupTitle = styled.h5`
  border-bottom: 2px solid ${colors.N40};
  padding-bottom: ${gridSize() / 2}px;
`;

export const Shortcuts = styled.dl`
  padding-left: 0;
`;

export const Shortcut = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-top: ${gridSize() / 2}px;
`;

export const ShortcutKeys = styled.dd`
  margin-top: 0;
`;

export const ShortcutKey = styled.kbd`
  align-items: center;
  background-clip: padding-box;
  border: 1px solid ${colors.N50};
  border-radius: ${borderRadius()}px;
  box-sizing: border-box;
  display: flex;
  background-color: ${colors.N10};
  background-image: linear-gradient(to bottom, ${colors.N0}, ${colors.N20});
  background-repeat: repeat-x;
  font-size: 0.9em;
  justify-content: center;
  margin: 0 2px;
  min-height: 20px;
  min-width: 20px;
  padding: 0 5px;
  text-transform: uppercase;
  white-space: nowrap;
`;
