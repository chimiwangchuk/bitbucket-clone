import { colors, ThemeProps } from '@atlaskit/theme';

// Plucked from ....
// https://bitbucket.org/atlassian/atlaskit-mk-2/src/master/packages/core/button/examples/90-Theming.tsx

export function extract(
  newTheme: any,
  { mode, appearance, state }: ThemeProps
) {
  if (!newTheme[appearance]) {
    return undefined;
  }
  const root = newTheme[appearance];
  return Object.keys(root).reduce((acc: { [index: string]: string }, val) => {
    let node = root;
    [val, state, mode].forEach(item => {
      if (!node[item]) {
        return undefined;
      }
      if (typeof node[item] !== 'object') {
        acc[val] = node[item];
        return undefined;
      }
      node = node[item];
      return undefined;
    });
    return acc;
  }, {});
}

// @ts-ignore TODO: fix noImplicitAny error here
export const buttonTheme = theme => (currentTheme, themeProps) => {
  const { buttonStyles, ...rest } = currentTheme(themeProps);
  return {
    buttonStyles: {
      ...buttonStyles,
      ...extract(theme, themeProps),
    },
    ...rest,
  };
};

export const purpleTheme = {
  default: {
    background: {
      default: { light: colors.P400, dark: colors.P400 },
      hover: { light: colors.P200, dark: colors.P200 },
      active: { light: colors.P500, dark: colors.P500 },
      disabled: { light: colors.N30, dark: colors.DN70 },
      selected: { light: colors.R500, dark: colors.R500 },
      focus: { light: colors.P400, dark: colors.P400 },
    },
    boxShadow: {
      focus: {
        light: `${colors.P100} 0 0 0 2px`,
        dark: `${colors.P100} 0 0 0 2px`,
      },
    },
    color: {
      default: { light: colors.N0, dark: colors.N0 },
      hover: { light: colors.N0, dark: colors.N0 },
      active: { light: colors.N0, dark: colors.N0 },
      disabled: { light: colors.N0, dark: colors.DN30 },
      selected: { light: colors.N0, dark: colors.N0 },
      focus: { light: colors.N0, dark: colors.N0 },
    },
  },
};
