import Icon from '@atlaskit/icon';
import React from 'react';

import { BitkitIconTypes } from '../types';

const glyph = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="currentColor" fillRule="nonzero">
      <path d="M8 17.867a5.867 5.867 0 1 0-.001-11.732A5.867 5.867 0 0 0 8 17.866zM8 20A8 8 0 1 1 8 4a8 8 0 0 1 0 16z" />
      <path d="M16 17.867a5.867 5.867 0 1 0-.001-11.735A5.867 5.867 0 0 0 16 17.867zM16 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
    </g>
  </svg>
);

export const CompareIcon = (props: BitkitIconTypes) => (
  <Icon {...props} glyph={glyph} />
);
