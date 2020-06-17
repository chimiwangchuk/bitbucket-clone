import { ProfileClient as AkProfileClient } from '@atlaskit/profilecard';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './i18n';

type BBProfileClientConfig = {
  cacheMaxAge?: number;
  cacheSize?: number;
  fetchUser: (userId: string) => Promise<BB.User | BB.Team>;
  onError?: (e: Error) => void;
};

export default class ProfileClient extends AkProfileClient {
  bbConfig: {
    fetchUser: (userId: string) => Promise<BB.User | BB.Team>;
    onError?: (e: Error) => void;
  };

  constructor(extendedConfig: BBProfileClientConfig) {
    const { fetchUser, onError, ...config } = extendedConfig;
    // `url` is not used by our implementation of ProfileClient, but it's still
    // required as a prop by the @atlaskit/profilecard implementation we're extending
    super({ ...config, url: '' });
    this.bbConfig = { fetchUser, onError };
  }

  transformUser(user: BB.User | BB.Team) {
    if (user.type === 'team') {
      return {
        disabledAccountMessage: (
          <FormattedMessage {...messages.teamProfileCardMessage} />
        ),
        fullName: user.display_name,
        hasDisabledAccountLozenge: false,
        status: 'inactive',
      };
    }

    if (user.account_status === 'UNKNOWN') {
      throw new Error();
    }

    if (!user.account_id) {
      return {
        disabledAccountMessage: (
          <FormattedMessage
            {...messages.unmigratedAtlassianAccountProfileCardMessage}
          />
        ),
        fullName: user.display_name,
        hasDisabledAccountLozenge: false,
        // A bit of a hack (this will get passed through, *currently* harmlessly, to the underlying Fabric profile card component)
        // but this is a temporary user state so this code path won't stick around too long.
        hideProfileLink: true,
        status: 'inactive',
      };
    }

    // Attempt to generate a timestring based on the `zoneinfo` field, which can be
    // a value that is not IANA-compliant (meaning not supported by `Intl.DateTimeFormat`)
    let timestring;
    if (user.zoneinfo) {
      try {
        timestring = new Intl.DateTimeFormat(undefined, {
          timeZone: user.zoneinfo,
          hour: 'numeric',
          minute: 'numeric',
          weekday: 'short',
        }).format(Date.now());
      } catch (e) {
        if (this.bbConfig.onError) {
          this.bbConfig.onError(e);
        }
      }
    }

    let companyName = user.organization || user.department;
    if (user.organization && user.department) {
      companyName = `${user.organization} (${user.department})`;
    }

    const commonFields = {
      avatarUrl: user.links.avatar.href,
      companyName,
      fullName: user.display_name,
      location: user.location,
      status: user.account_status,
      timestring,
    };

    // omit `nickname` so the profile card doesn't render it in parens beside `fullName`
    // pass it as `meta` instead to render beneath where the job title would normally go
    if (user.display_name !== user.nickname) {
      return {
        ...commonFields,
        meta: user.nickname,
      };
    }

    return {
      ...commonFields,
      nickname: user.nickname,
    };
  }

  // @ts-ignore (TS thinks that @atlaskit/profilecard defines this as an instance member property vs. an instance member function)
  makeRequest(_cloudId: string, userId: string) {
    return this.bbConfig.fetchUser(userId).then(this.transformUser.bind(this));
  }
}
