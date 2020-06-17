import { InjectedIntl } from 'react-intl';
import { getProfileCardActions } from '@atlassian/bitbucket-user-profile';

import { atlassianAccountProfileClient } from './profile-client';
import { uncurlyAaid } from './uncurly-aaid';

export const buildProfilecardProvider = (config: { intl: InjectedIntl }) =>
  Promise.resolve({
    // Our profile client does not use this value yet, but it's required
    cloudId: 'null',
    getActions: (id: string) => {
      const aaid = uncurlyAaid(id) || id;
      return getProfileCardActions({
        intl: config.intl,
        profileUrl: `/${aaid}`,
      });
    },
    resourceClient: atlassianAccountProfileClient,
  });
