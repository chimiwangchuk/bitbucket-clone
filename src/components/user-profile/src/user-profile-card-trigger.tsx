import {
  ProfileCardTrigger,
  ProfilecardTriggerPosition,
  ProfileClient,
} from '@atlaskit/profilecard';
import React, { PureComponent } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';

import messages from './i18n';

type ActionsConfig = {
  intl: InjectedIntl;
  profileUrl: string | null | undefined;
};

export const getActions = (config: ActionsConfig) => [
  {
    callback: () => window.open(config.profileUrl || '', '_blank'),
    // @ts-ignore @atlaskit/profilecard hasn't updated their TS interface for actions
    id: 'view-profile',
    label: config.intl.formatMessage(messages.viewProfileAction),
    shouldRender: (data: any) =>
      !!config.profileUrl && (!data || !data.hideProfileLink),
  },
];

// `profileClient` is typed as an `Object` due to a Flow bug in @atlaskit/profilecard
// `profileClient` has an object Type schema (so its fields are read/write), but the
// instance of `ProfileClient` that's meant to be created and passed in has read-only fields
type Props = {
  /**
   * The Element that will trigger the user profile card. Must be a DOM element (can't just be
   * a primitive string/number/etc) in order to correctly position the card.
   */
  children: JSX.Element;
  intl: InjectedIntl;
  /** The position where the profile card should appear, relative to the contents of the avatar */
  position?: ProfilecardTriggerPosition;
  /**
   * An API client for retrieving User Profile information.
   * The profile client should expect the value of the `userId` prop as the argument for its `fetchUser` method.
   */
  profileClient: ProfileClient;
  /** The URL of a user's profile page */
  profileUrl?: string | null | undefined;
  /** The type of interaction that will trigger the user profile card */
  trigger?: 'click' | 'hover';
  /**
   * An identifier (e.g., UUID, AAID) for the Bitbucket user. This will be passed to the
   * `ProfileClient` in order to support fetching user data, so it should align with whatever
   * is expected by the `profileClient` prop
   */
  userId: string;
};

class UserProfileCardTrigger extends PureComponent<Props> {
  render() {
    const { intl, profileUrl } = this.props;

    return (
      <ProfileCardTrigger
        actions={getActions({ intl, profileUrl })}
        // Our profile client does not use this value yet, but it's required
        cloudId="null"
        position={this.props.position}
        resourceClient={this.props.profileClient}
        trigger={this.props.trigger}
        userId={this.props.userId}
      >
        {this.props.children}
      </ProfileCardTrigger>
    );
  }
}

export default injectIntl(UserProfileCardTrigger);
