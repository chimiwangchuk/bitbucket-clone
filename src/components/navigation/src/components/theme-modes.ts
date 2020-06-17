import { colors } from '@atlaskit/theme';
// @ts-ignore TODO: fix noImplicitAny error here
import { modeGenerator } from '@atlaskit/navigation-next';

// prettier-ignore
export { dark, light, settings as siteSettings } from 
// @ts-ignore TODO: fix noImplicitAny error here
'@atlaskit/navigation-next';

export const settings = modeGenerator({
  product: {
    text: colors.N900,
    background: colors.N20,
  },
});

export const focusedNavigation = modeGenerator({
  product: {
    text: colors.N500,
    background: colors.N0,
  },
});
