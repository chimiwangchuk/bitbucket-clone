import styled from '@emotion/styled';
import { colors } from '@atlaskit/theme';

export const TitleText = styled.span<{ fadeLinesAfterFirst: boolean }>`
  img {
    max-height: 1em;
    vertical-align: text-bottom;

    &.emoji {
      height: 1em;
    }
  }

  span:not(:first-of-type) {
    ${({ fadeLinesAfterFirst }) =>
      fadeLinesAfterFirst ? `color: ${colors.N200}` : null};
  }
`;
