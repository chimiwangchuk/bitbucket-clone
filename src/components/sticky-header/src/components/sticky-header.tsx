import React, { PureComponent, ReactNode } from 'react';
import ReactDom from 'react-dom';
import { throttle } from 'lodash-es';

import { connect } from 'react-redux';
import { BucketDispatch } from 'src/types/state';
import { TOGGLE_STICKY_HEADER_ACTIVE_STATUS } from 'src/redux/pull-request/actions/constants';
import * as styles from '../styles';

import { ScrollContext } from './context';

export type StickyHeaderProps = {
  content?: any;
  offset: number;
  topOffset?: number;
  children: ReactNode;
  shouldBeScrolled?: (
    container: HTMLElement | object | null | undefined,
    trigger: PureComponent<any> | JSX.Element | null | undefined,
    topOffset?: number
  ) => boolean;
  scrollContainer?: Window | HTMLElement;
  trigger: PureComponent<any> | JSX.Element | null | undefined;
} & {
  updateStickyHeaderActiveStatus: (isStickyHeaderShown: boolean) => void;
};

type StickyHeaderState = {
  isScrolled: boolean;
};

const mapDispatchToProps = (dispatch: BucketDispatch) => ({
  updateStickyHeaderActiveStatus: (isStickyHeaderShown: boolean) =>
    dispatch({
      type: TOGGLE_STICKY_HEADER_ACTIVE_STATUS,
      payload: isStickyHeaderShown,
    }),
});

class StickyHeader extends PureComponent<StickyHeaderProps, StickyHeaderState> {
  container: HTMLElement | null | undefined;
  delay: number;

  static contextType = ScrollContext;

  static defaultProps = {
    content: null,
    offset: 0,
    topOffset: 0,
    children: null,
    shouldBeScrolled(
      container: HTMLElement | { scrollY: number } | null | undefined,
      trigger: PureComponent<any> | null | undefined,
      topOffset?: number
    ): boolean {
      if (!container) {
        return false;
      }

      // eslint-disable-next-line react/no-find-dom-node
      const triggerEl = trigger ? ReactDom.findDOMNode(trigger) : undefined;
      const scrollOffset =
        container instanceof HTMLElement
          ? container.scrollTop
          : container.scrollY;

      let pageHeaderHeight = 0;

      if (triggerEl instanceof HTMLElement) {
        pageHeaderHeight = triggerEl.clientHeight - triggerEl.offsetTop;
      }

      return scrollOffset >= pageHeaderHeight + (topOffset || 0);
    },
    scrollContainer: window,
    trigger: null,
  };

  constructor(props: StickyHeaderProps) {
    super(props);

    // Delay for 60FPS
    this.delay = 1000 / 60;

    this.state = {
      isScrolled: false,
    };
  }

  componentDidMount() {
    // eslint-disable-next-line no-param-reassign
    if (this.props.scrollContainer === window) {
      this.props.scrollContainer.addEventListener('scroll', this.onScroll);
    }
    if (this.context.registerScrollHandler) {
      this.context.registerScrollHandler(this.onScroll);
    }
  }

  componentWillUnmount() {
    if (this.props.scrollContainer === window) {
      window.removeEventListener('scroll', this.onScroll);
    }

    if (this.context.deregisterScrollHandler) {
      this.context.deregisterScrollHandler(this.onScroll);
    }
  }

  onScroll = throttle((e): void => {
    const {
      shouldBeScrolled,
      topOffset,
      updateStickyHeaderActiveStatus,
    } = this.props;
    const { isScrolled } = this.state;
    const weShouldScroll =
      !!shouldBeScrolled &&
      shouldBeScrolled(e.currentTarget, this.props.trigger, topOffset);

    if (isScrolled !== weShouldScroll) {
      this.setState({ isScrolled: weShouldScroll });
      updateStickyHeaderActiveStatus(weShouldScroll);
    }
  }, this.delay);

  render() {
    const { offset, topOffset } = this.props;
    const { isScrolled } = this.state;

    return (
      // a11y (screen readers): We intentionally hide the sticky header from screen readers (set aria-hidden="true")
      // because screen readers don’t need a sticky header and the same content is already on the page for them
      // to interact with (e.g. merge button, etc.)
      <styles.StickyHeaderContent
        isShown={isScrolled}
        offset={offset}
        topOffset={topOffset || 0}
        aria-hidden="true"
      >
        {this.props.children}
      </styles.StickyHeaderContent>
    );
  }
}

export default connect(null, mapDispatchToProps)(StickyHeader);
