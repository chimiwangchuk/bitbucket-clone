import React, { PureComponent, ReactNode } from 'react';

import * as styles from './styles';

export type SidebarExpandedProps = {
  children?: ReactNode;
  isVisible: boolean;
  width: number;
};

export default class SidebarExpanded extends PureComponent<
  SidebarExpandedProps
> {
  static defaultProps = {
    children: [],
  };

  render() {
    const { isVisible, children, width } = this.props;

    return (
      <styles.ExpandedSidebar
        isVisible={isVisible}
        // Set this as an inline style instead of CSS-in-JS to avoid generating
        // 1 class per px value difference when resizing
        style={{ width: `${width}px` }}
      >
        {children}
      </styles.ExpandedSidebar>
    );
  }
}
