import React, { PureComponent } from 'react';

import { AvatarPropTypes } from '@atlaskit/avatar';
import { ProfilecardTriggerPosition } from '@atlaskit/profilecard';

import BaseUserAvatar from './base-user-avatar';
import DeletedUserProfileClient from './deleted-user-profile-client';
import UserProfileCardTrigger from './user-profile-card-trigger';

const deletedUserProfileClient = new DeletedUserProfileClient({
  // We can cache this forever
  cacheMaxAge: Number.MAX_SAFE_INTEGER,
  // `url` is not used by our implementation of ProfileClient, but it's still
  // required as a prop by the @atlaskit/profilecard implementation we're extending
  url: '',
});

export type DeletedUserAvatarProps = {
  /** A flag indicating whether or not to use the avatar as a trigger for a user profile card. */
  isProfileCardEnabled?: boolean;
  /** The position where the profile card should appear (if enabled), relative to the contents of the avatar. */
  profileCardPosition?: ProfilecardTriggerPosition;
  /** The type of interaction that will trigger the user profile card. */
  profileCardTrigger?: 'click' | 'hover';
  /** Customize the `name` prop passed to `@atlaskit/avatar`. Should incorporate the `privateName` argument into the return value. */
  renderName: (privateName: string) => string;
};

export default class DeletedUserAvatar extends PureComponent<
  DeletedUserAvatarProps & AvatarPropTypes
> {
  static defaultProps = {
    renderName: (name: string) => name,
  };

  render() {
    const {
      isProfileCardEnabled,
      profileCardPosition,
      profileCardTrigger,
      renderName,
      ...avatarProps
    } = this.props;

    const avatar = (
      <BaseUserAvatar
        {...avatarProps}
        isUserProfileCardEnabled={isProfileCardEnabled}
        renderName={renderName}
      />
    );

    if (!isProfileCardEnabled) {
      return avatar;
    }

    return (
      <UserProfileCardTrigger
        position={profileCardPosition}
        profileClient={deletedUserProfileClient}
        trigger={profileCardTrigger}
        // The underlying Fabric component expects a non-empty userId string
        userId="null"
      >
        {avatar}
      </UserProfileCardTrigger>
    );
  }
}
