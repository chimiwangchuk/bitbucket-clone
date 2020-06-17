import React, { Component, ComponentType } from 'react';

import { MenuItem } from '@atlassian/bitbucket-navigation';

// @ts-ignore TODO: fix noImplicitAny error here
const getDisplayName = c => c.displayName || c.name || 'Component';

export const withMenuItem = (menuItem: MenuItem) => (
  Comp: ComponentType<any>
) =>
  class WithMenuItem extends Component<any> {
    static WrappedComponent = Comp;
    static displayName = `WithMenuItem(${getDisplayName(Comp)})`;

    render() {
      return <Comp {...this.props} menuItem={menuItem} />;
    }
  };
