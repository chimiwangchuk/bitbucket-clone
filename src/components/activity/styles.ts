import { gridSize, colors } from '@atlaskit/theme';
import styled from '@emotion/styled';

export const EventContainer = styled.div`
  display: flex;
  padding: ${gridSize()}px 0;
`;

export const AvatarWrapper = styled.div`
  align-self: flex-start;
  flex: 0 0 25px;
  margin-right: ${gridSize()}px;
`;

export const EventBody = styled.div`
  flex-flow: column;
  overflow: hidden;
`;

export const ActorName = styled.small`
  a {
    color: ${colors.N200};
  }

  a:hover,
  a:focus {
    color: ${colors.B400};
  }
`;
