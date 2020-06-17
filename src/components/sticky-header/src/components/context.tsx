import React, { createContext, Component } from 'react';

/* eslint-disable @typescript-eslint/no-unused-vars */
export const ScrollContext = createContext({
  // @ts-ignore we need onScroll for types, but it's not used by default
  registerScrollHandler: (onScroll: () => void) => {},
  // @ts-ignore we need onScroll for types, but it's not used by default
  deregisterScrollHandler: (onScroll: () => void) => {},
});
/* eslint-enable @typescript-eslint/no-unused-vars */

type Props = {
  elementRef: React.RefObject<HTMLElement>;
};
type State = {
  registerScrollHandler: (onScroll: () => void) => void;
  deregisterScrollHandler: (onScroll: () => void) => void;
};

export default class ScrollProvider extends Component<Props, State> {
  state = {
    // eslint-disable-next-line react/no-unused-state
    registerScrollHandler: (onScroll: () => void) => {
      const { elementRef } = this.props;
      if (elementRef.current) {
        elementRef.current.addEventListener('scroll', onScroll);
      }
    },
    // eslint-disable-next-line react/no-unused-state
    deregisterScrollHandler: (onScroll: () => void) => {
      const { elementRef } = this.props;
      if (elementRef.current) {
        elementRef.current.removeEventListener('scroll', onScroll);
      }
    },
  };
  render() {
    return (
      <ScrollContext.Provider value={this.state}>
        {this.props.children}
      </ScrollContext.Provider>
    );
  }
}
