import { User } from 'src/components/types';
import {
  getAvatarUrl,
  getName,
  getProfileUrl,
} from 'src/components/user-profile/src/utils';
import { FabricUser } from '../types';

export function toFabricUser(user: Maybe<User>): FabricUser {
  return {
    id: user ? user.uuid : null,
    name: getName(user),
    avatarUrl: getAvatarUrl(user) || undefined,
    profileUrl: getProfileUrl(user) || undefined,
  };
}

export function toBBUser(user: Maybe<FabricUser>): BB.User {
  return {
    uuid: (user && user.id) || '',
    display_name: (user && user.name) || '',
    nickname: (user && user.name) || '',
    type: 'user',
    links: {
      self: {
        href: '',
      },
      avatar: {
        href: (user && user.avatarUrl) || '',
      },
      html: {
        href: (user && user.profileUrl) || '',
      },
    },
  };
}
