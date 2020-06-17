import styled from '@emotion/styled';
import { IconSizes } from '../types';

// styles copied from atlaskit's icon package for modification to support multi-color uncustomizable glyphs
// https://bitbucket.org/atlassian/atlaskit-mk-2/src/master/packages/core/icon/src/components/Icon.js
const sizes = {
  small: '16px',
  medium: '24px',
  large: '32px',
  xlarge: '48px',
};

// @ts-ignore TODO: fix noImplicitAny error here
const getSize = props => {
  if (props.size) {
    // @ts-ignore TODO: fix noImplicitAny error here
    return `height: ${sizes[props.size]}; width: ${sizes[props.size]};`;
  }
  return null;
};

export const PrideGlyphWrapper = styled.span<{ size?: IconSizes }>`
  display: inline-block;
  line-height: 1;
  border-radius: 50%;
  overflow: hidden;

  > svg {
    ${getSize} max-height: 100%;
    max-width: 100%;
    vertical-align: bottom;
  }
`;
