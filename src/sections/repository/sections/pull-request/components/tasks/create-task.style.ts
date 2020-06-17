import styled from '@emotion/styled';
import { colors, gridSize, typography } from '@atlaskit/theme';

export const CreateTaskContainer = styled.div`
  display: flex;
  margin-left: ${gridSize() / 2}px;
`;

/*
 * 1. Ensures the input takes up full width of sidebar.
 * 2. Ensures the input does not not butt up against the
 * edge of the create task icon while adding a new task
 * (aka while focused).
 */
export const CreateTaskFormContainer = styled.div<{ isFocused: boolean }>`
  width: 100%;
  ${({ isFocused }) => (isFocused ? `margin-left: ${gridSize()}px` : null)};
`;

export const CreateTaskIcon = styled.div`
  display: flex;
  margin-top: ${gridSize()}px;
  align-items: center;
`;

export const CreateTaskStatusWrapper = styled.div`
  padding-right: ${gridSize() - 2}px;
  line-height: '100%';
`;

export const CreateTaskErrorMessage = styled.div`
  ${typography.h200() as any};
  font-weight: normal;
  color: ${colors.R400};
  margin-top: ${gridSize() / 2}px;
  margin-left: ${gridSize() * 3 + gridSize() / 2}px;
`;
