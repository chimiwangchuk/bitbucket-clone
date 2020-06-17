import { CSSProperties } from 'react';
import { gridSize, colors } from '@atlaskit/theme';
import styled from '@emotion/styled';
import { media } from '@atlassian/bitkit-responsive';

import { overflowEllipsis } from 'src/styles/mixins';

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

export const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  /* Atlaskit overrides to fit our filter styles */
  > button {
    height: ${gridSize() * 5}px;
  }

  > * + * {
    margin: 0 ${gridSize()}px;
  }

  > :last-child {
    margin-right: 0;
  }

  ${media.upToMedium(`
    justify-content: flex-start;

    > * + * {
      margin: ${gridSize()}px;
    }
  `)}

  ${media.upToSmall(`
    > * + * {
      margin: ${gridSize()}px 0;
    }
  `)}
`;

export const SearchFilter = styled.div`
  width: ${gridSize() * 28}px;
  ${media.upToMedium(`
    width: 100%;
  `)}

  order: 0;
`;

export const Filter = styled.div<{ mobileOrder?: number }>`
  ${media.upToSmall(`
// @ts-ignore TODO: fix noImplicitAny error here
    order: ${({ mobileOrder }) => mobileOrder || 1};
  `)}
`;

export const Ellipsis = styled.div`
  ${overflowEllipsis('100%')};
`;
