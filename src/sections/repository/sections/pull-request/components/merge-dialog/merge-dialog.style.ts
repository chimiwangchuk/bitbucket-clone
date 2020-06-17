import { gridSize } from '@atlaskit/theme';
import styled from '@emotion/styled';

export const MergeErrorMessage = styled.div`
  margin-top: ${gridSize() / 2}px;
  display: flex;
  align-items: center;
`;

export const InnerButtonText = styled.span<{ isDisabled?: boolean }>`
  ${props => (props.isDisabled ? 'visibility: hidden' : '')};
`;

export const MergeWarningText = styled.div`
  margin: ${gridSize() * 2}px 0;
`;

export const TooltipContent = styled.div`
  width: ${gridSize() * 16}px;
  text-align: center;
`;
