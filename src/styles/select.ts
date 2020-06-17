import { layers } from '@atlaskit/theme';
import { BANNER_HEIGHT } from 'src/constants/navigation';

const MODAL_MENU_PORTAL_LAYER = layers.modal() + 10;

export const getModalMenuPortalStyles = (isBannerOpen: boolean) => {
  return {
    // @ts-ignore TODO: Upgrade @atlaskit/select and use `StylesConfig` as this full object's type
    // to fix noImplicitAny error here
    menuPortal: base => {
      const topOverride = isBannerOpen ? { top: base.top - BANNER_HEIGHT } : {};

      return {
        ...base,
        ...topOverride,
        zIndex: MODAL_MENU_PORTAL_LAYER,
      };
    },
  };
};
