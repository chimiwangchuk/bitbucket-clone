import AkAvatar, { AvatarPropTypes } from '@atlaskit/avatar';
import styled from '@emotion/styled';
import React, { PureComponent } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';

import { getAvatarUrl, getName } from './utils';

const AvatarContainer = styled.div`
  /* Remove extra padded height from AK avatar in order to help center-align vertically */
  line-height: 1;
`;

type BaseUserAvatarProps = {
  intl: InjectedIntl;
  /** A flag indicating whether or not the avatar is serving as the trigger for a user profile card */
  isUserProfileCardEnabled?: boolean;
  /** Customize the `name` prop passed to `@atlaskit/avatar`. Should incorporate the `privateName` argument into the return value. */
  renderName: (privateName: string) => string;
  /** A Bitbucket user or team. */
  user?: BB.User | BB.Team;
  tabIndex?: number;
};

class BaseUserAvatar extends PureComponent<
  BaseUserAvatarProps & AvatarPropTypes
> {
  render() {
    const {
      intl,
      isUserProfileCardEnabled,
      renderName,
      user,
      tabIndex,
      ...avatarProps
    } = this.props;

    const name = getName(user, intl);
    const displayName = renderName(name);
    const avatarUrl = getAvatarUrl(user);

    return (
      <AvatarContainer>
        <AkAvatar
          {...avatarProps}
          enableTooltip={!isUserProfileCardEnabled}
          name={displayName}
          src={avatarUrl || undefined}
          tabIndex={tabIndex || 0}
        />
      </AvatarContainer>
    );
  }
}

export default injectIntl(BaseUserAvatar);
