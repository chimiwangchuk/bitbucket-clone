import styled from '@emotion/styled';
import { ModalFooter } from '@atlaskit/modal-dialog';
import { gridSize, colors } from '@atlaskit/theme';

export const Header = styled.div`
  box-shadow: none;
  border-bottom: 1px solid ${colors.N30};
`;

export const Container = styled.div`
  padding-top: ${gridSize() * 2}px;
  padding-bottom: ${gridSize() * 2}px;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: ${gridSize() * 20}px;
`;

export const ConversationContainer = styled.div`
  display: flex;
  padding-bottom: ${gridSize()}px;
`;

export const Conversation = styled.div`
  flex-grow: 1;
  margin-left: ${gridSize()}px;
`;

export const Subtitle = styled.div`
  padding-top: ${gridSize()}px;
  padding-bottom: ${gridSize()}px;
`;

export const RightAlignedFooter = styled(ModalFooter)<any>`
  box-shadow: none;
  border-top: 1px solid ${colors.N30};
  justify-content: flex-end;
`;
