import styled from '@emotion/styled';
import { colors } from '@atlaskit/theme';

export const HelpBadge = styled.span<{ parentColor: string }>`
  display: block;
  width: 8px;
  height: 8px;
  background-color: ${colors.P100};
  position: absolute;
  top: -0;
  left: -2px;
  border-radius: 8px;
  border: 3px solid ${props => props.parentColor};
`;
