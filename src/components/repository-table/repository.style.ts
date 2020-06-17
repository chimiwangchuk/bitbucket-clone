import styled from '@emotion/styled';
import { css } from '@emotion/core';

import { colors } from '@atlaskit/theme';
import { overflowEllipsis } from 'src/styles/mixins';

import {
  TableCellMobileHidden,
  TableCellMobileOnly,
} from 'src/components/pageable-table';

export const HeaderLinkWrapper = styled.span`
  a {
    ${overflowEllipsis()};
    display: inline-block;
    vertical-align: top;
    max-width: 100%;

    &,
    &:hover,
    &:focus {
      color: ${colors.N800};
    }
  }
`;

// @ts-ignore TODO: fix noImplicitAny error here
const setFocusedColor = isFocused => {
  return isFocused
    ? css`
        background-color: ${colors.N20};
      `
    : null;
};

export const RepositoryRow = styled.tr<{ isFocused: boolean }>`
  ${({ isFocused }) => setFocusedColor(isFocused)};

  &:hover,
  &:focus {
    background-color: ${colors.N20};
  }
`;

export const IsPrivateRepositoryCellMobileHidden = styled(
  TableCellMobileHidden
)`
  text-align: right;
`;

export const IsPrivateRepositoryCellMobileOnly = styled(TableCellMobileOnly)`
  text-align: right;
`;

export const PrivateIcon = styled.div`
  color: ${colors.N300};
  padding-right: 10px;
`;

export const Description = styled.small`
  display: flex;
  align-items: center;
  margin: 0;
`;

export const Info = styled.small`
  margin: 2px 0;
  display: block;
  ${overflowEllipsis()};
`;
