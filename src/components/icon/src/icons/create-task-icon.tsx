import React from 'react';
import Icon from '@atlaskit/icon';
import { BitkitIconTypes } from '../types';

// Inlining the SVG to manually change snake-case props to camelCase
// so React is happy (https://github.com/facebook/react/issues/2250).
// @ts-ignore TODO: fix noImplicitAny error here
const glyph = props => (
  <svg {...props} width="14" height="14" viewBox="0 0 14 14">
    <g
      id="create-task-icon"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Background"
        fill="currentColor"
        x="1"
        y="1"
        width="12"
        height="12"
        rx="2"
      />
    </g>
  </svg>
);

export const CreateTaskIcon = (props: BitkitIconTypes) => (
  <Icon {...props} glyph={glyph} />
);
