import Button from '@atlaskit/button';
import { ModalFooter } from '@atlaskit/modal-dialog';
import { gridSize } from '@atlaskit/theme';
import styled from '@emotion/styled';

import { BranchLabel } from 'src/sections/repository/sections/pull-request/components/branches-and-state.style';

export const MergeButton = styled(Button)<any>`
  margin-right: ${gridSize()}px;
`;

export const MergeDialogFooter = styled(ModalFooter)`
  display: flex;
  justify-content: flex-end;
`;

export const MergeDialogActions = styled.div`
  justify-content: flex-end;
`;

export const MergeErrorMessage = styled.div`
  margin-top: ${gridSize() / 2}px;
  display: flex;
  align-items: center;
`;

export const ButtonContent = styled.div`
  position: relative;
`;

export const InnerButtonText = styled.span<{ isDisabled: boolean }>`
  ${props => (props.isDisabled ? 'visibility: hidden' : '')};
`;

export const MergeSpinner = styled.span`
  min-width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: ${gridSize() / 2}px;
`;

export const RepositoryOrRef = styled(BranchLabel)`
  margin-right: ${gridSize()}px;
  max-width: inherit;
`;
