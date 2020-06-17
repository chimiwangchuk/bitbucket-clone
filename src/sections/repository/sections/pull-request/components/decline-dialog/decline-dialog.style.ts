import { ModalFooter } from '@atlaskit/modal-dialog';
import { gridSize } from '@atlaskit/theme';
import styled from '@emotion/styled';
import Button from '@atlaskit/button';

export const DeclineButton = styled(Button)<any>`
  margin-right: ${gridSize()}px;
`;

export const DeclineDialogFooter = styled(ModalFooter)`
  justify-content: flex-end;
`;

export const DeclineErrorMessage = styled.div`
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

export const DeclineSpinner = styled.span`
  min-width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: ${gridSize() / 2}px;
`;
