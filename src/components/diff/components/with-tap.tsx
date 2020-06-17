import React, { Component, ComponentType, TouchEventHandler } from 'react';
import { debounce } from 'lodash-es';

interface Tappable {
  onTap: TouchEventHandler;
}

interface Touchable {
  onTouchMove?: TouchEventHandler;
  onTouchEnd?: TouchEventHandler;
  className?: string;
}

const TOUCH_MOVE_DEBOUNCE_DELAY = 100;
// @ts-ignore TODO: fix noImplicitAny error here
const getDisplayName = c => c.displayName || c.name || 'Component';

export default function withTap<T extends Touchable>(
  WrappedComponent: ComponentType<T>
) {
  return class extends Component<Tappable & T> {
    static displayName = `WithTap(${getDisplayName(WrappedComponent)})`;

    state = { isScroll: false };

    onTouchMove = () => {
      if (!this.state.isScroll) {
        this.setState({ isScroll: true });
      }
    };

    debouncedTouchMove = debounce(this.onTouchMove, TOUCH_MOVE_DEBOUNCE_DELAY, {
      leading: true,
      trailing: false,
    });

    // @ts-ignore TODO: fix noImplicitAny error here
    onTouchEnd = event => {
      const { onTap } = this.props;

      if (!this.state.isScroll) {
        onTap(event);
      }

      this.setState({ isScroll: false });
    };

    render() {
      const { onTap, ...props } = this.props;
      // `{...props as T}` is required due to a TS >= 3.2 bug (https://github.com/Microsoft/TypeScript/issues/28938#issuecomment-450636046)
      return (
        <WrappedComponent
          {...(props as T)}
          onTouchMove={this.debouncedTouchMove}
          onTouchEnd={this.onTouchEnd}
        />
      );
    }
  };
}
