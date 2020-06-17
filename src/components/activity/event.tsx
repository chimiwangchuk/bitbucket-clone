import { AvatarPropTypes } from '@atlaskit/avatar';
import React, { Component, ReactNode } from 'react';
import { RelativeDate } from '@atlassian/bitkit-date';

import { User } from 'src/components/types';
import {
  DeletedUserAvatar,
  DeletedUserName,
  UserAvatar,
  UserName,
} from 'src/components/user-profile';

import * as styles from './styles';

type Props = {
  actor: User | undefined;
  children: ReactNode;
  date: string | Date;
  renderActorAvatar: (
    actor: User | undefined,
    avatarProps: Partial<AvatarPropTypes>
  ) => ReactNode;
  renderActorName: (actor: User | undefined) => ReactNode;
};

export default class ActivityEvent extends Component<Props> {
  static defaultProps = {
    renderActorAvatar: (
      actor: User | undefined,
      avatarProps: Partial<AvatarPropTypes>
    ) => {
      if (!actor) {
        return <DeletedUserAvatar {...avatarProps} />;
      }
      return <UserAvatar {...avatarProps} user={actor} />;
    },
    renderActorName: (actor: User | undefined) => {
      if (!actor) {
        return <DeletedUserName />;
      }
      return <UserName user={actor} />;
    },
  };

  render() {
    const {
      actor,
      children,
      date,
      renderActorAvatar,
      renderActorName,
    } = this.props;

    return (
      <styles.EventContainer data-qa="pull-request-activity">
        <styles.AvatarWrapper>
          {renderActorAvatar(actor, { size: 'small' })}
        </styles.AvatarWrapper>
        <styles.EventBody data-qa="pull-request-activity-content">
          <div>{children}</div>
          <styles.ActorName>
            {renderActorName(actor)}
            {' · '}
            <RelativeDate date={date} />
          </styles.ActorName>
        </styles.EventBody>
      </styles.EventContainer>
    );
  }
}
