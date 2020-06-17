import { InjectedIntl } from 'react-intl';

import messages from './i18n';

type OptionalUserOrTeam = BB.User | BB.Team | null | undefined;

export const getAvatarUrl = (user: OptionalUserOrTeam) => {
  if (!user) {
    return undefined;
  }

  // Temporarily enable avatars for teams until we launch workspaces (PHAROS-465)
  if (user.type === 'team') {
    return user.links.avatar.href;
  }

  return user.links.avatar.href;
};

export const getName = (user: OptionalUserOrTeam, intl?: InjectedIntl) => {
  // Fall back to the original English string if `intl` is not available in the
  // consuming environment
  const formerUser = intl
    ? intl.formatMessage(messages.displayNameDeletedPrivateNickname)
    : messages.displayNameDeletedPrivateNickname.defaultMessage;

  if (!user) {
    return formerUser;
  }

  if (user.type === 'team') {
    return user.display_name;
  }

  return user.display_name || formerUser;
};

export const getProfileUrl = (user: OptionalUserOrTeam) => {
  if (!user || (user.type !== 'team' && user.account_status === 'closed')) {
    return undefined;
  }

  if (user.links.html) {
    return user.links.html.href;
  }

  return `/${user.uuid}/`;
};
