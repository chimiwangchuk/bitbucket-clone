import { gridSize, typography } from '@atlaskit/theme';
import styled from '@emotion/styled';

// messageType prop necessary to provide specific styles to the activity Error Message.
export const GenericMessageWrapper = styled.div<{
  messageType?: string;
}>`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: ${props =>
    props.messageType === 'activity'
      ? `${gridSize() * 2}px ${gridSize()}px ${gridSize() * 2 - 4}px`
      : `${gridSize() * 3}px ${gridSize()}px`};
  text-align: center;

  p + button {
    margin-top: ${gridSize()}px;
  }
`;

export const GenericMessageHeader = styled.h5`
  ${typography.h400() as any};
  align-items: center;
  display: flex;
`;

export const GenericMessageTitle = styled.span`
  padding-left: ${gridSize() / 2}px;
  padding-right: ${gridSize() / 2}px;
`;
