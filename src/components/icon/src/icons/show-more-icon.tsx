import React, { ReactNode } from 'react';
import Icon, { IconProps } from '@atlaskit/icon';
import * as styles from '../styled';
import { BitkitIconTypes } from '../types';

export type ShowMoreIconProps = BitkitIconTypes & {
  shouldAnimate: boolean;
};

// Some Typescript gymnastics to couple us to AK's Icon glyph prop
type Glyph = Required<IconProps>['glyph'];
type WrapperGlyph = (
  props: ArgumentsOf<Glyph>[0] & { children: ReactNode }
) => JSX.Element;

const ShowMoreBaseGlyph: WrapperGlyph = ({ children, ...props }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" version="1.1" {...props}>
    <g fill="currentColor">{children}</g>
  </svg>
);

const ShowMoreGlyph: Glyph = props => (
  <ShowMoreBaseGlyph {...props}>
    <circle cx="4" cy="8" r="1" />
    <circle cx="8" cy="8" r="1" />
    <circle cx="12" cy="8" r="1" />
  </ShowMoreBaseGlyph>
);

const ShowMoreGlyphAnimated: Glyph = props => (
  <ShowMoreBaseGlyph {...props}>
    <styles.FadingOutCircle cx="4" cy="8" r="1" />
    <styles.FadingOutCircle delay={200} cx="8" cy="8" r="1" />
    <styles.FadingOutCircle delay={400} cx="12" cy="8" r="1" />
  </ShowMoreBaseGlyph>
);

export const ShowMoreIcon = ({
  shouldAnimate,
  ...props
}: ShowMoreIconProps) => {
  const glyph = shouldAnimate ? ShowMoreGlyphAnimated : ShowMoreGlyph;

  return <Icon {...props} glyph={glyph} />;
};
