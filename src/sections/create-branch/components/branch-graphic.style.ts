import {
  borderRadius,
  gridSize,
  colors,
  codeFontFamily,
} from '@atlaskit/theme';
import styled from '@emotion/styled';

export const BranchGraphic = styled.div`
  display: flex;
  align-items: center;
  padding: ${gridSize() * 4}px 0;

  > :first-child {
    flex: 0 0 auto;
    margin-right: ${gridSize() * 4}px;
  }
`;

export const BranchLabels = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  /* We need to allow the container with labels to be narrow, so 'min-width' should be 0,
     but IE11 doesn't support it due to a bug, so using next minimal value of 1px */
  min-width: 1px;
  height: 60px;

  > :first-child {
    margin-top: -5px;
  }

  > :last-child {
    margin-bottom: -5px;
  }
`;

export const BranchLabelWrapper = styled.div`
  background: ${colors.N20};
  padding: ${gridSize() / 4}px ${gridSize() / 2}px;
  border-radius: ${borderRadius()}px;
  max-width: 100%;
  box-sizing: border-box;
`;

export const BranchLabel = styled.div`
  display: flex;
  align-items: center;
  font-family: ${codeFontFamily()};

  > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
