import { ProfilecardTriggerPosition } from '@atlaskit/profilecard';
import React, { PureComponent } from 'react';

import DeletedUserProfileClient from './deleted-user-profile-client';
import UserName from './user-name';
import UserProfileCardTrigger from './user-profile-card-trigger';

const deletedUserProfileClient = new DeletedUserProfileClient({
  // We can cache this forever
  cacheMaxAge: Number.MAX_SAFE_INTEGER,
  // `url` is not used by our implementation of ProfileClient, but it's still
  // required as a prop by the @atlaskit/profilecard implementation we're extending
  url: '',
});

type Props = {
  /** A flag indicating whether or not to use the name as a trigger for a user profile card. */
  isProfileCardEnabled?: boolean;
  /** The position where the profile card should appear (if enabled), relative to the contents of the name. */
  profileCardPosition?: ProfilecardTriggerPosition;
  /** The type of interaction that will trigger the user profile card. */
  profileCardTrigger?: 'click' | 'hover';
};

export default class DeletedUserName extends PureComponent<Props> {
  render() {
    const {
      isProfileCardEnabled,
      profileCardPosition,
      profileCardTrigger,
    } = this.props;

    const name = <UserName user={undefined} />;

    if (!isProfileCardEnabled) {
      return name;
    }

    return (
      <UserProfileCardTrigger
        position={profileCardPosition}
        profileClient={deletedUserProfileClient}
        trigger={profileCardTrigger}
        // The underlying Fabric component expects a non-empty userId string
        userId="null"
      >
        <span>{name}</span>
      </UserProfileCardTrigger>
    );
  }
}
