import React, { PureComponent } from 'react';

import { AvatarPropTypes } from '@atlaskit/avatar';
import {
  ProfilecardTriggerPosition,
  ProfileClient,
} from '@atlaskit/profilecard';

import BaseUserAvatar from './base-user-avatar';
import UserProfileCardTrigger from './user-profile-card-trigger';

export type UserAvatarProps = {
  /** The position where the profile card should appear (if enabled), relative to the contents of the avatar. */
  profileCardPosition?: ProfilecardTriggerPosition;
  /** The type of interaction that will trigger the user profile card. */
  profileCardTrigger?: 'click' | 'hover';
  /**
   * An API client for retrieving User Profile information.
   * The profile client should expect a UUID as the argument for its `fetchUser` method.
   */
  profileClient?: ProfileClient;
  /** The URL of a user's profile page. */
  profileUrl?: string;
  /** Customize the `name` prop passed to `@atlaskit/avatar`. Should incorporate the `privateName` argument into the return value. */
  renderName: (privateName: string) => string;
  /** A Bitbucket user or team. */
  user: BB.User | BB.Team;
  tabIndex?: number;
};

export default class UserAvatar extends PureComponent<
  UserAvatarProps & AvatarPropTypes
> {
  static defaultProps = {
    renderName: (name: string) => name,
  };

  render() {
    const {
      profileCardPosition,
      profileCardTrigger,
      profileClient,
      profileUrl,
      renderName,
      user,
      ...avatarProps
    } = this.props;

    const avatar = (
      <BaseUserAvatar
        {...avatarProps}
        isUserProfileCardEnabled={!!profileClient}
        renderName={renderName}
        user={user}
      />
    );

    if (!profileClient) {
      return avatar;
    }

    return (
      <UserProfileCardTrigger
        position={profileCardPosition}
        profileUrl={profileUrl}
        profileClient={profileClient}
        trigger={profileCardTrigger}
        userId={user.uuid}
      >
        {avatar}
      </UserProfileCardTrigger>
    );
  }
}
