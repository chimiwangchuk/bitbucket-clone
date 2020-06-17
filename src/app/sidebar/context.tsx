/* eslint-disable react/no-unused-state */
import React, { createContext, Component } from 'react';

type fn = () => void;

/* eslint-disable @typescript-eslint/no-unused-vars */
export const SidebarContext = createContext({
  hasSidebar: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  renderSidebar() {},
  // @ts-ignore we need renderSidebar for types, but it's not used by default
  onRenderSidebar(renderSidebar: fn) {
    return () => {};
  },
});
/* eslint-enable @typescript-eslint/no-unused-vars */

type Props = {};
type State = {
  hasSidebar: boolean;
  renderSidebar: fn;
  onRenderSidebar: (renderSidebar: fn) => fn;
};

const renderCallbacks: fn[] = [];

export default class SidebarProvider extends Component<Props, State> {
  state = {
    hasSidebar: false,
    renderSidebar: () => {
      renderCallbacks.forEach(cb => cb());
    },
    onRenderSidebar: (renderSidebar: fn) => {
      renderCallbacks.push(renderSidebar);
      this.setState({
        hasSidebar: true,
      });

      return () => {
        const idx = renderCallbacks.indexOf(renderSidebar);
        renderCallbacks.splice(idx, 1);
        this.setState({ hasSidebar: renderCallbacks.length > 0 });
      };
    },
  };

  render() {
    return (
      <SidebarContext.Provider value={this.state}>
        {this.props.children}
      </SidebarContext.Provider>
    );
  }
}
