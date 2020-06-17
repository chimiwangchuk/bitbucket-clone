import React, { Component, ReactNode } from 'react';
import Portal from '@atlaskit/portal';
import Blanket from '@atlaskit/blanket';
// @ts-ignore TODO: fix noImplicitAny error here
import { FocusLock } from '@atlaskit/layer-manager';
import { layers } from '@atlaskit/theme';
import { Animation } from './animation';

/**
 * This modal-dialog is a simplified version of @atlaskit/modal-dialog.
 * It was needed as a result of a UI limitation as discussed in AK-5477.
 * https://ecosystem.atlassian.net/browse/AK-5477.
 */

type DialogChromelessProps = {
  isOpen: boolean;
  shouldCloseOnEscapePress: boolean;
  onClose: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  children: ReactNode;
};

const StyledFillScreen = ({ scrollDistance, style, children }: any) => (
  <div
    style={{
      height: '100vh',
      left: 0,
      overflowY: 'auto',
      position: 'absolute',
      top: `${scrollDistance}px`,
      width: '100%',
      zIndex: layers.modal(),
      ...style,
    }}
  >
    {children}
  </div>
);

const Content = ({ style, children }: any) => (
  <div
    style={{
      position: 'fixed',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      height: '100vh',
      width: '100%',
      pointerEvents: 'none',
      zIndex: layers.modal(),
      ...style,
    }}
    role="dialog"
    tabIndex={-1}
  >
    {children}
  </div>
);

export default class DialogChromeless extends Component<
  DialogChromelessProps,
  any
> {
  isMounted: boolean;
  escapeIsHeldDown: boolean;
  componentDidMount() {
    this.isMounted = true;
    // @ts-ignore fix handleKeyDown return type
    document.addEventListener('keydown', this.handleKeyDown, false);
    document.addEventListener('keyup', this.handleKeyUp, false);
  }
  componentWillUnmount() {
    this.isMounted = false;
    // @ts-ignore fix handleKeyDown return type
    document.removeEventListener('keydown', this.handleKeyDown, false);
    document.removeEventListener('keyup', this.handleKeyUp, false);
  }
  handleKeyUp = () => {
    this.escapeIsHeldDown = false;
  };
  handleKeyDown = (event: any) => {
    const { onClose, shouldCloseOnEscapePress } = this.props;

    // avoid consumers accidently closing multiple modals if they hold escape.
    if (this.escapeIsHeldDown) {
      return;
    }
    if (event.key === 'Escape') {
      this.escapeIsHeldDown = true;
    }

    // only the foremost modal should be interactive.
    if (!this.isMounted) {
      return;
    }

    switch (event.key) {
      case 'Escape':
        if (shouldCloseOnEscapePress) {
          onClose(event);
        }
        break;
      default:
    }
  };
  render() {
    const { isOpen, onClose, children } = this.props;
    return (
      <Portal zIndex={layers.modal()}>
        <Animation in={isOpen}>
          {({ fade, slide }) => (
            <StyledFillScreen style={fade} scrollDistance={0}>
              <FocusLock enabled={isOpen} autoFocus={false}>
                <Content style={slide}>{children}</Content>
              </FocusLock>
              <Blanket isTinted onBlanketClicked={onClose} />
            </StyledFillScreen>
          )}
        </Animation>
      </Portal>
    );
  }
}
