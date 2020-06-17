import styled from '@emotion/styled';
import { borderRadius, colors, gridSize } from '@atlaskit/theme';

export const Content = styled.div`
  margin: ${gridSize()}px 0;
`;

export const CloneDialogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${gridSize() * 2}px;
`;

export const ButtonGroup = styled.div`
  margin-top: ${gridSize() * 3}px;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: ${gridSize() * 2}px;
`;

export const InlineContent = styled.div`
  min-width: 400px;
`;

export const CloneClient = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  border: 1px solid ${colors.N30};
  border-radius: ${borderRadius()}px;
  padding: ${gridSize() * 2}px;
  margin-right: ${gridSize()}px;
  &:last-child {
    margin-right: 0;
  }
`;

export const CloneClients = styled.div`
  display: flex;
  margin-top: ${gridSize() * 3}px;
`;
