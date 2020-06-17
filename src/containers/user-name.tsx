import React, { ComponentType, PureComponent } from 'react';
import { connect } from 'react-redux';

import { ProfilecardTriggerPosition } from '@atlaskit/profilecard';

import { Team, User } from 'src/components/types';
import {
  DeletedUserName,
  getProfileUrl,
  UserName as BaseUserName,
  UserProfileCardTrigger,
} from 'src/components/user-profile';
import { getIsWorkspaceUiEnabled } from 'src/selectors/feature-selectors';
import { userProfileClient } from 'src/utils/profile-client';

type Props = {
  isProfileCardEnabled: boolean;
  isWorkspaceUiEnabled: boolean;
  // TODO: Upgrade to ElementType when on a newer version of @types/react and typescript
  linkComponent: ComponentType<any> | string;
  profileCardPosition?: ProfilecardTriggerPosition;
  profileCardTrigger: 'click' | 'hover';
  user: Team | User | null | undefined;
};

class UserName extends PureComponent<Props> {
  static defaultProps = {
    isProfileCardEnabled: false,
    isWorkspaceUiEnabled: false,
    // TODO: Upgrade to ElementType when on a newer version of @types/react and typescript
    linkComponent: 'a' as ComponentType<any> | string,
    profileCardTrigger: 'hover' as 'click' | 'hover',
  };

  render() {
    const {
      isProfileCardEnabled,
      isWorkspaceUiEnabled,
      linkComponent: LinkComponent,
      profileCardPosition,
      profileCardTrigger,
      user,
    } = this.props;

    if (!user) {
      return (
        <DeletedUserName
          isProfileCardEnabled={isProfileCardEnabled}
          profileCardPosition={profileCardPosition}
          profileCardTrigger={profileCardTrigger}
        />
      );
    }

    // Temporarily link to the profile page until workspace UI is enabled (and the profile page is gone)
    const href = !isWorkspaceUiEnabled ? getProfileUrl(user) : undefined;

    const name = <BaseUserName user={user} />;

    const wrappedName = href ? (
      <LinkComponent href={href}>{name}</LinkComponent>
    ) : (
      // ProfileCardTrigger children must be wrapped in a DOM element (can't just be a primitive string/number/etc)
      // in order to correctly position the card
      <span>{name}</span>
    );

    // Temporarily disable profile cards for teams until we launch workspaces (PHAROS-465)
    if (!isProfileCardEnabled || user.type === 'team') {
      return wrappedName;
    }

    return (
      <UserProfileCardTrigger
        position={profileCardPosition}
        profileUrl={href}
        profileClient={userProfileClient}
        trigger={profileCardTrigger}
        userId={user.uuid}
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

export default connect(mapStateToProps)(UserName);
