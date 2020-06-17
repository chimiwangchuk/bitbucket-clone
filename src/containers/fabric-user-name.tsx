import { ProfilecardTriggerPosition } from '@atlaskit/profilecard';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { FabricUser } from 'src/components/conversation-provider/types';
import {
  DeletedUserName,
  UserProfileCardTrigger,
} from 'src/components/user-profile';
import { getIsWorkspaceUiEnabled } from 'src/selectors/feature-selectors';
import { userProfileClient } from 'src/utils/profile-client';

type Props = {
  isProfileCardEnabled: boolean;
  isWorkspaceUiEnabled: boolean;
  profileCardPosition?: ProfilecardTriggerPosition;
  profileCardTrigger?: 'click' | 'hover';
  user: FabricUser | null | undefined;
};

class FabricUserName extends PureComponent<Props> {
  static defaultProps = {
    profileCardTrigger: 'hover' as 'click' | 'hover',
  };

  render() {
    const {
      isProfileCardEnabled,
      isWorkspaceUiEnabled,
      profileCardPosition,
      profileCardTrigger,
      user,
      ...nameProps
    } = this.props;

    if (!user || !user.id) {
      return (
        <DeletedUserName
          {...nameProps}
          isProfileCardEnabled={isProfileCardEnabled}
          profileCardPosition={profileCardPosition}
          profileCardTrigger={profileCardTrigger}
        />
      );
    }

    // This user will already have been transformed in a privacy-compliant manner by
    // `src/components/conversation-provider/utils/to-user.ts` before passed into
    // this component as a prop, so it's safe to use the fields directly.
    const { id: userId, name, profileUrl } = user;

    // Temporarily link to the profile page until workspace UI is enabled (and the profile page is gone)
    const href = !isWorkspaceUiEnabled ? profileUrl : undefined;

    const wrappedName = href ? (
      <a href={href}>{name}</a>
    ) : (
      // ProfileCardTrigger children must be wrapped in a DOM element (can't just be a primitive string/number/etc)
      // in order to correctly position the card
      <span>{name}</span>
    );

    if (!isProfileCardEnabled) {
      return wrappedName;
    }

    return (
      <UserProfileCardTrigger
        position={profileCardPosition}
        profileUrl={href}
        profileClient={userProfileClient}
        trigger={profileCardTrigger}
        userId={userId}
      >
        {wrappedName}
      </UserProfileCardTrigger>
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

export default connect(mapStateToProps)(FabricUserName);
