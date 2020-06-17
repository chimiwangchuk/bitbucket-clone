import styled from '@emotion/styled';
import { codeFontFamily, colors, gridSize } from '@atlaskit/theme';
import { subtleLink } from './mixins';

export const CenteredRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`;

export const CenteredColumn = styled(CenteredRow)`
  flex-direction: column;
`;

// width: 0 set due to browser bug with nested flex containers
// see: https://stackoverflow.com/a/34355447
export const CodeBlock = styled.code`
  color: ${colors.N800};
  flex: 1;
  font-family: ${codeFontFamily()};
  font-size: 12px;
  overflow-x: auto;
  white-space: pre-wrap;
  width: 0;
`;

export const CodeContainer = styled.div`
  align-items: center;
  background: ${colors.N20};
  display: flex;
  margin-top: ${gridSize()}px;
  padding: ${gridSize()}px;
`;

export const SubtleLink = styled.a`
  ${subtleLink};
`;

export const HorizontalRule = styled.hr`
  background: ${colors.N40};
  border: 0;
  height: 2px;
`;

export const IconWithCountWrapper = styled.span`
  align-items: center;
  display: flex;
  & + & {
    margin-left: ${gridSize() * 2}px;
  }
`;

export const IconWithCountIconWrapper = styled.span`
  align-items: center;
  display: flex;
  margin-right: ${gridSize() / 2}px;
`;
