import React from 'react';
import Icon from '@atlaskit/icon';
import { BitkitIconTypes } from '../types';

// Inlining the SVG to manually change snake-case props to camelCase
// so React is happy (https://github.com/facebook/react/issues/2250).
// @ts-ignore TODO: fix noImplicitAny error here
const glyph = props => (
  <svg viewBox="0 0 16 16" {...props}>
    <g fill="none" fillRule="evenodd">
      <rect fill="#6554C0" width="14" height="14" x="1" y="1" rx="3" />
      <rect width="15" height="15" x=".5" y=".5" stroke="#FFF" rx="3" />
      <path
        fill="#FFF"
        d="M9.50888348 9H4c-.55228475 0-1-.44771525-1-1s.44771525-1 1-1h5.50888348L8.30330086 5.78361162c-.40440115-.40802583-.40440115-1.06956641 0-1.47759225.40440114-.40802583 1.06006495-.40802583 1.46446609 0l2.92893215 2.9551845c.4044012.40802584.4044012 1.06956642 0 1.47759226L9.76776695 11.6939806c-.40440114.4080259-1.06006495.4080259-1.46446609 0-.40440115-.4080258-.40440115-1.0695664 0-1.4775922L9.50888348 9z"
      />
    </g>
  </svg>
);

export const FileRenamedIcon = (props: BitkitIconTypes) => (
  <Icon {...props} glyph={glyph} />
);
