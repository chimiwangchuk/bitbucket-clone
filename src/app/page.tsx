import React, { Component } from 'react';
import { connect } from 'react-redux';

import { debounce } from 'lodash-es';
import { ScrollProvider } from 'src/components/sticky-header';
import toggleMobileHeader from 'src/redux/global/actions/toggle-mobile-header';
import { toggleUpToSmallBreakpoint } from 'src/redux/global/actions/toggle-responsive-breakpoint';
import { WINDOW_RESIZE_DEBOUNCE_DELAY } from 'src/sections/global/constants';
import {
  getSiteMessageBanner,
  getIsMobileHeaderActive,
} from 'src/selectors/global-selectors';
import isMobile from 'src/utils/is-mobile';
import { isUpToSmallBreakpoint } from 'src/utils/is-responsive-breakpoint';

import { BucketState, BucketDispatch } from 'src/types/state';
import * as styles from './page.styled';
import { SidebarPlaceholder } from './sidebar';

type StateProps = {
  isBannerOpen: boolean;
  isMobileHeaderActive: boolean;
};

type DispatchProps = {
  onWindowResize?: (shouldMobileHeaderDisplay: boolean) => void;
  toggleUpToSmall?: (shouldToggleToSmall: boolean) => void;
};

type OwnProps = {
  children?: React.ReactNode;
  onWindowResize?: (shouldMobileHeaderDisplay: boolean) => void;
  toggleUpToSmall?: (shouldToggleToSmall: boolean) => void;
};

type Props = StateProps & DispatchProps & OwnProps;

class Page extends Component<Props> {
  componentDidMount() {
    window.addEventListener('resize', this.debouncedOnWindowResize);
    this.onWindowResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedOnWindowResize);
  }

  previousWindowWidth: number = window.innerWidth;
  scrollEl: React.RefObject<HTMLDivElement> = React.createRef();

  onWindowResize = () => {
    if (this.props.onWindowResize) {
      const currentWindowWidth = window.innerWidth;
      if (this.previousWindowWidth !== currentWindowWidth) {
        this.previousWindowWidth = currentWindowWidth;
        this.props.onWindowResize(isMobile());
      }
    }
    if (this.props.toggleUpToSmall) {
      this.props.toggleUpToSmall(isUpToSmallBreakpoint());
    }
  };

  debouncedOnWindowResize = debounce(
    this.onWindowResize,
    WINDOW_RESIZE_DEBOUNCE_DELAY
  );

  render() {
    const { isBannerOpen, isMobileHeaderActive } = this.props;

    return (
      <styles.PageLayout isMobileHeaderActive={isMobileHeaderActive}>
        <ScrollProvider elementRef={this.scrollEl}>
          <styles.Content ref={this.scrollEl} isBannerOpen={isBannerOpen}>
            {this.props.children}
          </styles.Content>
          {!isMobileHeaderActive && (
            <SidebarPlaceholder isBeingRenderedInsideMobileNav={false} />
          )}
        </ScrollProvider>
      </styles.PageLayout>
    );
  }
}

const mapStateToProps = (state: BucketState): StateProps => ({
  isBannerOpen: Boolean(getSiteMessageBanner(state)),
  isMobileHeaderActive: getIsMobileHeaderActive(state),
});

const mapDispatchToProps = (
  dispatch: BucketDispatch,
  props: OwnProps
): DispatchProps => ({
  onWindowResize:
    props.onWindowResize ||
    ((shouldMobileHeaderDisplay: boolean) =>
      dispatch(toggleMobileHeader(shouldMobileHeaderDisplay))),
  toggleUpToSmall:
    props.toggleUpToSmall ||
    ((shouldToggleUpToSmall: boolean) =>
      dispatch(toggleUpToSmallBreakpoint(shouldToggleUpToSmall))),
});

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(Page);
