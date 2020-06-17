import { css } from '@emotion/core';
/**
 * NOTE: RECONSIDER WHEN WE ARE ABLE TO USE A MOBILE-FIRST APPROACH
 * 320px / 16px   = 20em
 * 576px / 16px   = 36em
 * 768px / 16px   = 48em (50em for mobile 1st & doing min-width instead)
 * 1024px / 16px  = 64em (65em for mobile 1st & doing min-width instead)
 * 1280px / 16px  = 80em
 * 1520px / 16px = 95em
 */
export type sizeTypes =
  | 'upToXSmall'
  | 'upToSmall'
  | 'upToMedium'
  | 'upToLarge'
  | 'upToXLarge'
  | 'upToXXLarge';

type SizeToBreakpointMapping = { [S in sizeTypes]: number };

export const sizes: SizeToBreakpointMapping = {
  upToXSmall: 320,
  upToSmall: 576,
  upToMedium: 768,
  upToLarge: 1024,
  upToXLarge: 1280,
  upToXXLarge: 1520,
};

type CssArguments = ArgumentsOf<typeof css>;
type SizeToCSSMapping = {
  [S in sizeTypes]: (...args: CssArguments) => ReturnType<typeof css>;
};

/**
 * Copied from on Styled Component official docs example:
 * https://github.com/styled-components/styled-components/blob/master/docs/tips-and-tricks.md
 * Modified to use min-width instead of max-width.
 */
export const media: SizeToCSSMapping = Object.keys(sizes).reduce(
  (accumulator, label: sizeTypes) => {
    // use em in breakpoints to work properly cross-browser and support users
    // changing their browsers font-size: https://zellwk.com/blog/media-query-units/
    const emSize = sizes[label] / 16;

    accumulator[label] = (...args: CssArguments) => css`
      @media (max-width: ${emSize}em) {
        ${css(...args)};
      }
    `;
    return accumulator;
  },
  {} as SizeToCSSMapping
);

/**
 * DEPRECATED: use utils within 'src/components/accessibility' instead
 * Copied from https://gist.github.com/ffoodd/000b59f431e3e64e4ce1a24d5bb36034
 * Implements screen reader only CSS class
 */
export const screenReaderOnlyCSS = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`;
