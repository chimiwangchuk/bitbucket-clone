import React from 'react';
import Icon from '@atlaskit/icon';
import { BitkitIconTypes } from '../types';

// Inlining the SVG to manually change snake-case props to camelCase
// so React is happy (https://github.com/facebook/react/issues/2250).
// @ts-ignore TODO: fix noImplicitAny error here
const glyph = props => (
  <svg
    {...props}
    x="0px"
    y="0px"
    viewBox="0 0 16 16"
    style={{ enableBackground: 'new 0 0 16 16' }}
  >
    <style>{`.st0 { fill: #42526E; }`}</style>
    <path
      className="st0"
      d="M2,7H1.5C1.3,7,1.2,7,1,7.1V6V3c0-1.1,0.9-2,2-2h3c1.9,0,3.4,1.3,3.9,3H13c1.1,0,2,0.9,2,2
      v1.1C14.8,7,14.7,7,14.5,7H14V6c0-0.6-0.4-1-1-1H9c0-1.7-1.3-3-3-3H3C2.4,2,2,2.4,2,3v3V7z M2.1,8h11.8c1.1,0,2,0.9,2,2
      c0,0.1,0,0.2,0,0.2l-0.3,3c-0.1,1-1,1.8-2,1.8H2.4c-1,0-1.9-0.8-2-1.8l-0.3-3C0,9.1,0.8,8.1,1.9,8C1.9,8,2,8,2.1,8z"
    />
  </svg>
);

export const FolderOpenIcon = (props: BitkitIconTypes) => (
  <Icon {...props} glyph={glyph} />
);
