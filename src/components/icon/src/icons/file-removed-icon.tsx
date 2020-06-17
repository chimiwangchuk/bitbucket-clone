import React from 'react';
import Icon from '@atlaskit/icon';
import { BitkitIconTypes } from '../types';

// Inlining the SVG to manually change snake-case props to camelCase
// so React is happy (https://github.com/facebook/react/issues/2250).
// @ts-ignore TODO: fix noImplicitAny error here
const glyph = props => (
  <svg viewBox="0 0 16 16" {...props}>
    <g fill="none" fillRule="evenodd">
      <rect fill="#FF5630" width="14" height="14" x="1" y="1" rx="3" />
      <rect width="15" height="15" x=".5" y=".5" stroke="#FFF" rx="3" />
      <path fill="#FFF" fillRule="nonzero" d="M4 7h8v2H4z" />
    </g>
  </svg>
);

export const FileRemovedIcon = (props: BitkitIconTypes) => (
  <Icon {...props} glyph={glyph} />
);
