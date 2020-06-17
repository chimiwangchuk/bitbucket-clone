import styled from '@emotion/styled';

import { colors } from '@atlaskit/theme';
import { LineType } from '@atlassian/bitkit-diff/types';

type ExpandedLineType = LineType | 'conflict';

export type LineGroupProps = {
  type: ExpandedLineType;
  percentHeight: number;
};

const backgroundMap: { [type in ExpandedLineType]: string } = {
  normal: colors.N0,
  add: colors.G50,
  del: colors.R50,
  empty: colors.N30,
  loaded: colors.N0,
  conflict: colors.Y50,
};

export const LineGroup = styled.div<LineGroupProps>`
  background-color: ${({ type }) => backgroundMap[type]};
  ${({ percentHeight }) => `height: ${percentHeight}%`};
  width: 10px;
  position: relative;
`;

// When there are too many lines one line changes don't always show up
// Adding a min-height can make the scroll map too long and lose diffs towards
// the bottom. By adding an absolutely positioned element nested inside each
// line group we can ensure every non-normal line group will respect the
// min-height without pushing lower elements down.
export const FloatingLineGroup = styled.div<{ type: ExpandedLineType }>`
  background-color: ${({ type }) => backgroundMap[type]};
  position: absolute;
  top: 0;
  min-height: 2px;
  height: 100%;
  width: 100%;
  visibility: ${({ type }) => (type === 'normal' ? 'hidden' : 'visible')};
`;

export const ScrollBarWrapper = styled.div<{
  isSideBySide?: boolean;
  scrollbarWidth: number;
}>`
  position: absolute;
  top: 0;
  height: 100%;
  right: 0;
  margin-right: ${({ scrollbarWidth }) => scrollbarWidth}px;
  border-left: 1px solid ${colors.N40};
`;

export const ScrollBar = styled.div`
  width: 10px;
  height: 100%;
  display: inline-block;
`;

export const ScrollContent = styled.div`
  height: 100%;
  overflow: auto;
  padding-right: 25px;
`;

export const DiffScrollMap = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
`;
