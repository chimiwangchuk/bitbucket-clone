import React, { PureComponent, ReactNode } from 'react';

import Button from '@atlaskit/button';

import * as styles from './styles';

export type SidebarCollapsedProps = {
  children?: ReactNode;
  icon?: JSX.Element;
  isVisible: boolean;
  onToggle: () => void;
  width: number;
};

export default class SidebarCollapsed extends PureComponent<
  SidebarCollapsedProps
> {
  static defaultProps = {
    children: [],
  };

  render() {
    const { icon, isVisible, children, onToggle, width } = this.props;

    return (
      <styles.CollapsedSidebar
        isVisible={isVisible}
        // Set this as an inline style instead of CSS-in-JS to avoid generating
        // 1 class per px value difference when resizing
        style={{ width: `${width}px` }}
      >
        {icon && (
          <Button appearance="subtle" iconBefore={icon} onClick={onToggle} />
        )}
        {children}
      </styles.CollapsedSidebar>
    );
  }
}
