import React from 'react';

import { BitkitIconTypes } from '../types';
import * as styles from './pride-icon.styled';

const prideBucketGlyph = () => (
  <svg viewBox="0 0 792 792" width="32" height="32">
    <title>Bitbucket Logo Pride</title>
    <defs>
      <linearGradient
        id="gradient-lighten"
        gradientUnits="userSpaceOnUse"
        x1="650.0464"
        y1="1112.6672"
        x2="391.5135"
        y2="1287.6945"
        gradientTransform="matrix(1 0 0 1 0 -726)"
      >
        <stop offset="7.000000e-02" stopColor="#ffffff" stopOpacity="0.4" />
        <stop offset="1" stopColor="#ffffff" />
      </linearGradient>
      <linearGradient id="gradient-rainbow" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#ff5630" />
        <stop offset="25%" stopColor="#ff5630" />
        <stop offset="25%" stopColor="#ff8b00" />
        <stop offset="37.5%" stopColor="#ff8b00" />
        <stop offset="37.5%" stopColor="#ffab00" />
        <stop offset="50%" stopColor="#ffab00" />
        <stop offset="50%" stopColor="#36b37e" />
        <stop offset="62.5%" stopColor="#36b37e" />
        <stop offset="62.5%" stopColor="#00b8d9" />
        <stop offset="75%" stopColor="#00b8d9" />
        <stop offset="75%" stopColor="#8777d9" />
        <stop offset="100%" stopColor="#8777d9" />
      </linearGradient>
    </defs>
    <rect
      x="0"
      y="0"
      rx="396"
      ry="0"
      width="792"
      height="792"
      fill="url(#gradient-rainbow)"
    />
    <g transform="translate(56, 40) scale(0.9)">
      <path
        fill="#ffffff"
        d="M120.1,148.9c-9.7,0-17.6,7.9-17.6,17.6c0,0.9,0,1.8,0,2.6l74.9,453.6c0.9,5.3,3.5,10.6,7.9,14.1l0,0  c4.4,3.5,9.7,6.2,15.9,6.2l139.2-166.5H321l-30.8-162.1h338.3l23.8-145.3c1.8-9.7-5.3-18.5-15-20.3c-0.9,0-1.8,0-2.6,0H120.1z"
      />
      <path
        fill="url(#gradient-lighten)"
        d="M628.4,314.5H462.8l-28.2,162.1H320.1L185.3,636.9c4.4,3.5,9.7,6.2,15.9,6.2h358.5c8.8,0,15.9-6.2,17.6-15  L628.4,314.5z"
      />
    </g>
  </svg>
);

export const PrideIcon = (props: BitkitIconTypes) => (
  <styles.PrideGlyphWrapper
    size={props.size}
    onClick={props.onClick}
    aria-label={props.label}
  >
    {prideBucketGlyph()}
  </styles.PrideGlyphWrapper>
);
