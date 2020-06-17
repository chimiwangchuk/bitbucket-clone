import Button from '@atlaskit/button';
import { colors, gridSize } from '@atlaskit/theme';
import styled from '@emotion/styled';

export const TargetButton = styled(Button)`
  padding: 0;
  min-width: ${gridSize() * 5}px;
  justify-content: center;
  height: ${gridSize() * 4}px;
`;

export const TargetButtonText = styled.span`
  color: ${colors.N200};
`;

export const DownIconWrapper = styled.div`
  margin-left: -${gridSize() * 1.5}px;
  margin-right: -${gridSize() * 0.75}px;
`;
