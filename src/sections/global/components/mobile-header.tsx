import AkMobileHeader from '@atlaskit/mobile-header';
import Button from '@atlaskit/button';
import RoomMenuIcon from '@atlaskit/icon/glyph/room-menu';
import React, { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl, InjectedIntl } from 'react-intl';

import { getMobileHeaderState } from 'src/selectors/global-selectors';
import updateMobileHeaderState from 'src/redux/global/actions/update-mobile-header-state';
import { MobileHeaderState } from 'src/redux/global/actions';
import { BANNER_HEIGHT } from 'src/constants/navigation';

import { SidebarPlaceholder, SidebarContext } from 'src/app/sidebar';
import { BucketState } from 'src/types/state';
import messages from './mobile-header.i18n';

type MobileHeaderProps = {
  intl: InjectedIntl;
  heading: string | ReactNode;
  renderNavigation?: () => any;
  customMenu?: ReactNode;
  mobileHeaderState: MobileHeaderState;
  setDrawerState: typeof updateMobileHeaderState;
  isBannerOpen?: boolean;
};

export class MobileHeader extends Component<MobileHeaderProps> {
  render() {
    const {
      intl,
      heading,
      customMenu,
      renderNavigation,
      mobileHeaderState,
      setDrawerState,
      isBannerOpen,
    } = this.props;

    return (
      <SidebarContext.Consumer>
        {({ hasSidebar }) => (
          <AkMobileHeader
            customMenu={customMenu}
            drawerState={mobileHeaderState}
            onDrawerClose={() => setDrawerState('none')}
            onNavigationOpen={() => setDrawerState('navigation')}
            menuIconLabel={intl.formatMessage(messages.menuIconLabel)}
            sidebar={() => (
              <SidebarPlaceholder isBeingRenderedInsideMobileNav />
            )}
            navigation={renderNavigation && (() => renderNavigation())}
            pageHeading={heading}
            topOffset={isBannerOpen ? BANNER_HEIGHT : 0}
            secondaryContent={
              hasSidebar && (
                <Button
                  iconBefore={<RoomMenuIcon label="Sidebar" size="large" />}
                  onClick={() => setDrawerState('sidebar')}
                  appearance="subtle"
                />
              )
            }
          />
        )}
      </SidebarContext.Consumer>
    );
  }
}

const mapStateToProps = (state: BucketState) => ({
  mobileHeaderState: getMobileHeaderState(state),
});

const mapDispatchToProps = {
  setDrawerState: updateMobileHeaderState,
};

export default compose<any, any, any>(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(MobileHeader);
