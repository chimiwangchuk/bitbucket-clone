import { css } from '@emotion/core';
import { colors } from '@atlaskit/theme';

export const overflowEllipsis = (maxWidth = 'inherit') => `
  overflow: hidden;
  max-width: ${maxWidth};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const link = css`
  &,
  &:hover,
  &:focus {
    color: ${colors.N800};
  }
`;

export const subtleLink = css`
  &,
  &:hover,
  &:focus {
    color: ${colors.N300};
  }
`;
