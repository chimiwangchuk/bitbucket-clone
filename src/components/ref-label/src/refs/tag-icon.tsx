import React from 'react';
import Icon, { size, IconProps } from '@atlaskit/icon';

const glyph = () => (
  <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1">
    <title>Tag Small</title>
    <g
      id="Symbols"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g id="tag_small" stroke="#42526E">
        <path d="M3.5,4.70710678 L3.5,8.2773188 L7.96468888,12.2955388 L12.2920077,7.53548811 L7.808132,3.5 L4.70710678,3.5 L3.5,4.70710678 Z M6.5,7.5 C5.94771525,7.5 5.5,7.05228475 5.5,6.5 C5.5,5.94771525 5.94771525,5.5 6.5,5.5 C7.05228475,5.5 7.5,5.94771525 7.5,6.5 C7.5,7.05228475 7.05228475,7.5 6.5,7.5 Z" />
      </g>
    </g>
  </svg>
);

const TagIcon = (props: IconProps) => (
  <Icon size={size.small} glyph={glyph} {...props} />
);

export default TagIcon;
