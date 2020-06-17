import React from 'react';
import Icon from '@atlaskit/icon';
import { BitkitIconTypes } from '../types';

// Inlining the SVG to manually change snake-case props to camelCase
// so React is happy (https://github.com/facebook/react/issues/2250).
// @ts-ignore TODO: fix noImplicitAny error here
const glyph = props => (
  <svg viewBox="0 0 16 16" {...props}>
    <g fill="none" fillRule="evenodd">
      <rect fill="#FFAB00" width="14" height="14" x="1" y="1" rx="3" />
      <rect width="15" height="15" x=".5" y=".5" stroke="#FFF" rx="3" />
      <path
        fill="#FFF"
        d="M4.01095129 11.4162698c-.03460638.1588194.01397015.3242009.1292215.4399418.11525135.1157409.28167627.1662741.44271745.1344265l1.85519694-.3803763-2.04744532-2.0492777-.37969057 1.8552857zm6.67101901-7.13015493C10.5011218 4.10314173 10.2533609 4 9.99468235 4c-.25867857 0-.50643946.10314173-.68728798.28611487L4.55405299 9.03654019l2.40791105 2.41015971 4.75334136-4.75090076c.3795928-.38217768.3795928-.99478477 0-1.37696244l-1.0333351-1.03272183z"
      />
    </g>
  </svg>
);

export const FileModifiedIcon = (props: BitkitIconTypes) => (
  <Icon {...props} glyph={glyph} />
);
