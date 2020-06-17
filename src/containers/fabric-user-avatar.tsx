import AkAvatar, { AvatarPropTypes } from '@atlaskit/avatar';
import { ProfilecardTriggerPosition } from '@atlaskit/profilecard';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { FabricUser } from 'src/components/conversation-provider/types';
import {
  DeletedUserAvatar,
  UserProfileCardTrigger,
} from 'src/components/user-profile';
import { getIsWorkspaceUiEnabled } from 'src/selectors/feature-selectors';
import { userProfileClient } from 'src/utils/profile-client';
import { BucketState } from 'src/types/state';

type Props = {
  isProfileCardEnabled?: boolean;
  isWorkspaceUiEnabled?: boolean;
  profileCardPosition?: ProfilecardTriggerPosition;
  profileCardTrigger?: 'click' | 'hover';
  user: FabricUser | null | undefined;
};

class FabricUserAvatar extends PureComponent<Props & AvatarPropTypes> {
  render() {
    const {
      isProfileCardEnabled,
      isWorkspaceUiEnabled,
      profileCardPosition,
      profileCardTrigger,
      user,
      ...avatarProps
    } = this.props;

    if (!user || !user.id) {
      return (
        <DeletedUserAvatar
          {...avatarProps}
          isProfileCardEnabled={isProfileCardEnabled}
          profileCardPosition={profileCardPosition}
          profileCardTrigger={profileCardTrigger}
        />
      );
    }

    // This user will already have been transformed in a privacy-compliant manner by
    // `src/components/conversation-provider/utils/to-user.ts` before passed into
    // this component as a prop, so it's safe to use the fields directly.
    const { avatarUrl, id: userId, name, profileUrl } = user;

    // Temporarily link to the profile page until workspace UI is enabled (and the profile page is gone)
    const href = !isWorkspaceUiEnabled ? profileUrl : undefined;

    const avatar = (
      <AkAvatar
        {...avatarProps}
        enableTooltip={!isProfileCardEnabled}
        href={href}
        name={name}
        src={avatarUrl}
      />
    );

    if (!isProfileCardEnabled) {
      return avatar;
    }

    return (
      <UserProfileCardTrigger
        position={profileCardPosition}
        profileUrl={href}
        profileClient={userProfileClient}
        trigger={profileCardTrigger}
        userId={userId}
      >
        {avatar}
      </UserProfileCardTrigger>
    );
  }
}

const mapStateToProps = (state: BucketState, props: Props) => ({
  isProfileCardEnabled:
    props.isProfileCardEnabled === false
      ? false
      : !!state.global.features['user-profile-cards'],
  isWorkspaceUiEnabled: getIsWorkspaceUiEnabled(state),
});

export default connect(mapStateToProps)(FabricUserAvatar);
