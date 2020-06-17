import styled from '@emotion/styled';
import { colors, gridSize, typography } from '@atlaskit/theme';

const halfGridSize = gridSize() / 2;

export const FileNumber = styled.span`
  font-weight: bold;
`;

export const IconContainer = styled.div`
  position: relative;
`;

export const ConflictIndicator = styled.span`
  background-color: ${colors.Y300};
  border-radius: ${gridSize()}px;
  height: ${gridSize()}px;
  left: ${gridSize() * 3 + halfGridSize}px;
  position: absolute;
  top: ${gridSize()}px;
  width: ${gridSize()}px;
`;

export const ErrorWrapper = styled.div`
  align-items: center;
  display: flex;
`;

export const TruncatedContentMessageTitle = styled.strong`
  ${typography.h500() as any}
`;
