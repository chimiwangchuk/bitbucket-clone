import { gridSize } from '@atlaskit/theme';
import cn from 'classnames';
import React, { PureComponent } from 'react';
import styled from '@emotion/styled';

import { MenuItem } from '../types';

type ConnectMenuItemIconProps = {
  className?: string;
  menuItem: MenuItem;
};

const Icon = styled.span`
  height: ${gridSize() * 3}px;
  width: ${gridSize() * 3}px;

  &::before {
    font-size: 20px;
    margin-left: 2px;
    margin-top: -10px;
  }
`;

const IconImg = styled.img`
  height: ${gridSize() * 3}px;
  width: ${gridSize() * 3}px;
`;

class ConnectMenuItemIcon extends PureComponent<ConnectMenuItemIconProps> {
  render() {
    const { menuItem } = this.props;

    if (menuItem.icon_url) {
      return <IconImg src={menuItem.icon_url} alt="" role="presentation" />;
    }

    return (
      <Icon
        className={cn(
          this.props.className,
          'aui-icon',
          'aui-icon-large',
          menuItem.icon_class
        )}
      />
    );
  }
}

export default ConnectMenuItemIcon;
