import React, { Component, ReactNode } from 'react';
import * as styles from './overlay-dropdown.style';

type Props = {
  children: (showOverlay: (e: React.MouseEvent<any>) => void) => ReactNode;
  overlayContent: (
    hideOverlay: (e: React.MouseEvent<any>) => void
  ) => ReactNode;
  onOverlayHidden: () => void;
};

type State = {
  isOverlayShown: boolean;
  isAnimating: boolean;
};

export default class OverlayDropdown extends Component<Props, State> {
  state = { isOverlayShown: false, isAnimating: false };

  componentWillUnmount() {
    if (this.state.isOverlayShown) {
      this.props.onOverlayHidden();
    }
  }

  toggleOverlay = (isOverlayShown: boolean) => (e: React.MouseEvent<any>) => {
    if (e) {
      e.preventDefault();
    }

    if (!isOverlayShown) {
      this.props.onOverlayHidden();
    }
    this.setState({ isOverlayShown, isAnimating: true });
  };

  onAnimationEnd = () => {
    this.setState({ isAnimating: false });
  };

  render() {
    const { isOverlayShown, isAnimating } = this.state;
    const showOverlay = this.toggleOverlay(true);
    const hideOverlay = this.toggleOverlay(false);
    return (
      <styles.Root>
        {this.props.children(showOverlay)}
        {(isOverlayShown || isAnimating) && (
          <styles.OverlayPanel
            isShown={isOverlayShown}
            onAnimationEnd={this.onAnimationEnd}
          >
            {this.props.overlayContent(hideOverlay)}
          </styles.OverlayPanel>
        )}
      </styles.Root>
    );
  }
}
