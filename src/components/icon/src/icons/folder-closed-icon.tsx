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
    <style type="text/css">{`.st0 { fill: #42526E; }`}</style>
    <path
      className="st0"
      d="M9.9,4H13c1.1,0,2,0.9,2,2v7c0,1.1-0.9,2-2,2H3c-1.1,0-2-0.9-2-2V6V3c0-1.1,0.9-2,2-2h3
      C7.9,1,9.4,2.3,9.9,4z"
    />
  </svg>
);

export const FolderClosedIcon = (props: BitkitIconTypes) => (
  <Icon {...props} glyph={glyph} />
);
