import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AvatarPropTypes } from '@atlaskit/avatar';
import { ProfilecardTriggerPosition } from '@atlaskit/profilecard';

import { Team, User } from 'src/components/types';
import {
  DeletedUserAvatar,
  getProfileUrl,
  UserAvatar as BaseUserAvatar,
} from 'src/components/user-profile';
import { getIsWorkspaceUiEnabled } from 'src/selectors/feature-selectors';
import { userProfileClient } from 'src/utils/profile-client';

type Props = {
  isProfileCardEnabled: boolean;
  isWorkspaceUiEnabled: boolean;
  profileCardPosition?: ProfilecardTriggerPosition;
  profileCardTrigger?: 'click' | 'hover';
  user: Team | User | null | undefined;
};

class UserAvatar extends PureComponent<Props & AvatarPropTypes> {
  render() {
    const {
      isProfileCardEnabled,
      isWorkspaceUiEnabled,
      profileCardPosition,
      profileCardTrigger,
      user,
      ...avatarProps
    } = this.props;

    if (!user) {
      return (
        <DeletedUserAvatar
          {...avatarProps}
          isProfileCardEnabled={isProfileCardEnabled}
          profileCardPosition={profileCardPosition}
          profileCardTrigger={profileCardTrigger}
        />
      );
    }

    // Temporarily link to the profile page until workspace UI is enabled (and the profile page is gone)
    const href = !isWorkspaceUiEnabled ? getProfileUrl(user) : undefined;

    // Temporarily disable profile cards for teams until we launch workspaces (PHAROS-465)
    if (!isProfileCardEnabled || user.type === 'team') {
      return (
        <BaseUserAvatar href={href || undefined} {...avatarProps} user={user} />
      );
    }

    return (
      <BaseUserAvatar
        href={href || undefined}
        {...avatarProps}
        profileCardPosition={profileCardPosition}
        profileCardTrigger={profileCardTrigger}
        profileClient={userProfileClient}
        profileUrl={href}
        user={user}
      />
    );
  }
}

// @ts-ignore TODO: fix noImplicitAny error here
const mapStateToProps = (state, props) => ({
  isProfileCardEnabled:
    props.isProfileCardEnabled === false
      ? false
      : !!state.global.features['user-profile-cards'],
  isWorkspaceUiEnabled: getIsWorkspaceUiEnabled(state),
});

export default connect(mapStateToProps)(UserAvatar);
