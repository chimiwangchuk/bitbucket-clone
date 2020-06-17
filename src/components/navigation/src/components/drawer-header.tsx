import React, { ComponentType, PureComponent } from 'react';
import Avatar from '@atlaskit/avatar';
import { BitbucketWordmark } from '@atlaskit/logo';
// @ts-ignore TODO: fix noImplicitAny error here
import Item from '@atlaskit/item';

import * as styles from './drawer-header.style';

type DrawerHeaderProps = {
  isGlobalContext: boolean;
  isPrivate?: boolean;
  href?: string;
  name?: string;
  logo?: string;
  linkComponent?: ComponentType<any>;
};

class DrawerHeader extends PureComponent<DrawerHeaderProps> {
  render() {
    const {
      isGlobalContext,
      isPrivate,
      href,
      name,
      logo,
      linkComponent,
    } = this.props;

    if (isGlobalContext) {
      return (
        <styles.BitbucketLogoWrapper>
          <BitbucketWordmark />
        </styles.BitbucketLogoWrapper>
      );
    }

    const avatarIcon = logo ? (
      <Avatar
        size="large"
        appearance="square"
        src={logo}
        enableTooltip={false}
        name={name}
        status={isPrivate ? 'locked' : undefined}
      />
    ) : (
      undefined
    );

    return (
      <styles.DrawerWrapper>
        <Item href={href} linkComponent={linkComponent} elemBefore={avatarIcon}>
          <styles.HeaderNameWrapper>{name}</styles.HeaderNameWrapper>
        </Item>
      </styles.DrawerWrapper>
    );
  }
}

export default DrawerHeader;
