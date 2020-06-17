import { CSSProperties } from 'react';
import styled from '@emotion/styled';
import { gridSize, colors } from '@atlaskit/theme';
import { overflowEllipsis } from 'src/styles/mixins';

import { media } from '@atlassian/bitkit-responsive';

export const Filters = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

export const FilterContainer = styled.div`
  margin-left: ${gridSize()}px;
  margin-bottom: ${gridSize() * 1.5}px;

  ${media.upToSmall(` margin-left: 0; `)}
`;

export const PLACEHOLDER_COLOR = colors.N400;

type StateProps = {
  isFocused: boolean;
};

export const subtleSelector = (css: CSSProperties, state: StateProps) => ({
  backgroundColor: state.isFocused ? css.backgroundColor : 'transparent',
  borderColor: state.isFocused ? css.borderColor : 'transparent',
});

export const nothingSelectedColor = () => ({
  color: colors.N400,
});

export const Ellipsis = styled.div`
  ${overflowEllipsis('100%')};
`;

export const SearchContainer = styled.div`
  width: ${gridSize() * 28}px;
  margin-bottom: ${gridSize() * 1.5}px;

  ${media.upToMedium(` width: 100%; `)}
`;
