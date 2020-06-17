import styled from '@emotion/styled';
import { borderRadius, colors, gridSize, typography } from '@atlaskit/theme';

export const FieldWrapper = styled.div`
  padding-top: ${gridSize()}px;
`;

export const FormLabel = styled.label`
  ${typography.h200() as any};
  display: inline-block;
  margin-bottom: ${gridSize() / 2}px;
  margin-top: 0;
  margin-right: ${gridSize() / 2}px;
`;

export const FieldRefSelector = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const FieldRefSelectorDropdown = styled.div`
  flex-grow: 1;
`;

export const FieldRefSelectorBuildStatus = styled.div`
  margin-left: ${gridSize() / 2}px;
`;

export const FooterContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  position: relative;
`;

export const BranchTypeSelectorTooltipContent = styled.div`
  max-width: ${gridSize() * 33}px;
`;

export const BranchTypeSelectorIconWrapper = styled.div`
  display: inline-block;
`;

export const CursorPointer = styled.button`
  background-color: transparent;
  border: transparent;
  color: currentColor;
  cursor: pointer;
  padding: 0;
  position: relative;
  bottom: -${gridSize() / 4}px;
`;

export const BranchTypeSelector = styled.div`
  width: ${gridSize() * 16}px;
`;

export const BranchTypeOptionOther = styled.span`
  font-style: italic;
`;

export const BranchNameInputWrapper = styled.div`
  align-items: stretch;
  display: flex;
`;

export const BranchNamePrefix = styled.div`
  align-items: center;
  background-color: ${colors.N20};
  border: 2px solid ${colors.N40};
  border-radius: ${borderRadius()}px 0 0 ${borderRadius()}px;
  display: flex;
  justify-content: center;
  max-width: ${gridSize() * 19}px;
  margin-right: -3px;
  padding: 0 ${gridSize()}px;

  /* AK Tooltip inserts an empty div and we need to target it
     to properly add ellipsis to the branch name prefix */
  > div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const BranchNameInput = styled.div`
  flex-grow: 1;
`;

export const BranchNameError = styled.div`
  max-width: ${gridSize() * 25}px;
`;

export const DisabledOption = styled.span`
  color: ${colors.N80};
`;
