import React, { ComponentType, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import NavigationKeyboardShortcuts from 'src/sections/global/containers/navigation-keyboard-shortcuts';
import MobileHeader from 'src/sections/global/components/mobile-header';
import SiteBanner from 'src/sections/global/containers/site-banner';
import {
  getSiteMessageBanner,
  getIsMobileHeaderActive,
} from 'src/selectors/global-selectors';
import * as siteBannerStyles from 'src/components/site-banner.style';

import Page from './page';
import { SidebarProvider } from './sidebar';

type Props = {
  children?: ReactNode;
  Component: ComponentType<any>;
  mobileHeading: ReactNode | string;
};

export const NavigationWrapper = (props: Props) => {
  const { Component, mobileHeading, children } = props;
  const isMobileHeaderActive = useSelector(getIsMobileHeaderActive);
  const isBannerOpen = useSelector(getSiteMessageBanner);

  // `SidebarProvider` is used by the main page and the mobile header, so needs to be
  // an ancestor of both.
  return (
    <ThemeProvider theme={{}}>
      <SidebarProvider>
        {isMobileHeaderActive && (
          <MobileHeader
            renderNavigation={() => (
              <Component isBeingRenderedInsideMobileNav />
            )}
            heading={mobileHeading}
          />
        )}
        {isBannerOpen && (
          <siteBannerStyles.Wrapper>
            <SiteBanner />
          </siteBannerStyles.Wrapper>
        )}
        <Component isMobileHeaderActive={isMobileHeaderActive}>
          <NavigationKeyboardShortcuts>
            <Page>{children}</Page>
          </NavigationKeyboardShortcuts>
        </Component>
      </SidebarProvider>
    </ThemeProvider>
  );
};
