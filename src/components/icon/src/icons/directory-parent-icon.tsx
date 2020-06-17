import Icon from '@atlaskit/icon';
import React from 'react';

import { BitkitIconTypes } from '../types';

// Inlining the SVG to manually change snake-case props to camelCase
// so React is happy (https://github.com/facebook/react/issues/2250).

// @ts-ignore TODO: fix noImplicitAny error here
const glyph = props => (
  <svg width="19px" height="14px" viewBox="0 0 19 14" version="1.1" {...props}>
    <g
      id="Source-Folder-View"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g
        transform="translate(-401.000000, -408.000000)"
        id="up-folder"
        fillRule="nonzero"
        fill="#42526E"
      >
        <g transform="translate(401.000000, 408.000000)">
          <path
            d="M-1.523,6.5 C-2.063,6.5 -2.5,6.948 -2.5,7.5 C-2.5,8.051 -2.063,8.5 -1.523,8.5 L9.523,8.5 C10.062,8.5 10.5,8.051 10.5,7.5 C10.5,6.948 10.062,6.5 9.523,6.5 L-1.523,6.5 Z"
            id="Clip-5-Copy"
            transform="translate(4.000000, 7.500000) rotate(90.000000) translate(-4.000000, -7.500000) "
          />
          <path
            d="M4.20246154,12 C3.53784615,12 3,12.448 3,13 C3,13.551 3.53784615,14 4.20246154,14 L17.7975385,14 C18.4609231,14 19,13.551 19,13 C19,12.448 18.4609231,12 17.7975385,12 L4.20246154,12 Z"
            id="Clip-5-Copy"
            transform="translate(11.000000, 13.000000) rotate(-180.000000) translate(-11.000000, -13.000000) "
          />
          <path
            d="M4.731375,-1.193875 L1.801375,1.762125 C1.399375,2.170125 1.399375,2.830125 1.801375,3.238125 L4.731375,6.195125 C4.934375,6.398125 5.199375,6.500125 5.464375,6.500125 C5.729375,6.500125 5.994375,6.398125 6.196375,6.195125 C6.601375,5.786125 6.601375,5.125125 6.196375,4.717125 L3.999375,2.501125 L6.196375,0.283125 C6.601375,-0.123875 6.601375,-0.785875 6.196375,-1.193875 C5.993375,-1.396875 5.729375,-1.499875 5.464375,-1.499875 C5.198375,-1.499875 4.934375,-1.396875 4.731375,-1.193875 Z"
            id="Clip-2-Copy"
            transform="translate(4.000000, 2.500125) rotate(90.000000) translate(-4.000000, -2.500125) "
          />
        </g>
      </g>
    </g>
  </svg>
);

export const DirectoryParentIcon = (props: BitkitIconTypes) => (
  <Icon {...props} glyph={glyph} />
);
