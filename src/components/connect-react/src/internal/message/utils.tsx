import React from 'react';
import Error from '@atlaskit/icon/glyph/error';
import Info from '@atlaskit/icon/glyph/info';
import Tick from '@atlaskit/icon/glyph/check-circle';
import Warning from '@atlaskit/icon/glyph/warning';
import { colors } from '@atlaskit/theme';

export interface Icons {
  generic: JSX.Element;
  info: JSX.Element;
  hint: JSX.Element;
  success: JSX.Element;
  warning: JSX.Element;
  error: JSX.Element;
}

export const iconMap = (key: keyof Icons, color?: string) => {
  const icons = {
    generic: <Info label="Generic" primaryColor={color || colors.P300} />,
    info: <Info label="Info" primaryColor={color || colors.P100} />,
    hint: <Info label="Hint" primaryColor={color || colors.B200} />,
    success: <Tick label="Success" primaryColor={color || colors.G300} />,
    warning: <Warning label="Warning" primaryColor={color || colors.Y300} />,
    error: <Error label="Error" primaryColor={color || colors.R300} />,
  };
  return icons[key];
};

export function getIcon(key: keyof Icons, color?: string) {
  return iconMap(key, color);
}
