import * as Sentry from '@sentry/browser';
import { stringify } from 'qs';
import { ProfileClient } from '@atlassian/bitbucket-user-profile';

import { Team, User } from 'src/components/types';
import urls from 'src/urls/profile';
import authRequest, { jsonHeaders } from 'src/utils/fetch';
import { uncurlyAaid } from 'src/utils/uncurly-aaid';

const PROFILE_CLIENT_CACHE_MAX_AGE = 1000 * 60 * 5;

const identityFields = [
  'department',
  'job_title',
  'location',
  'organization',
  'zoneinfo',
];

const identityFieldQuery = stringify({
  fields: identityFields.map(f => `+${f}`).join(','),
});

const onError = (e: Error) => {
  Sentry.captureException(e);
};

export const teamProfileClient = new ProfileClient({
  cacheMaxAge: PROFILE_CLIENT_CACHE_MAX_AGE,
  fetchUser: (uuid: string): Promise<Team> =>
    fetch(authRequest(urls.api.v20.team(uuid), { headers: jsonHeaders })).then(
      response => {
        return response.ok ? response.json() : Promise.reject();
      }
    ),
  onError,
});

export const userProfileClient = new ProfileClient({
  cacheMaxAge: PROFILE_CLIENT_CACHE_MAX_AGE,
  fetchUser: (uuid: string): Promise<User> => {
    const url = urls.api.v20.user(uuid);
    return fetch(
      authRequest(`${url}?${identityFieldQuery}`, { headers: jsonHeaders })
    ).then(response => {
      return response.ok ? response.json() : Promise.reject();
    });
  },
  onError,
});

export const atlassianAccountProfileClient = new ProfileClient({
  cacheMaxAge: PROFILE_CLIENT_CACHE_MAX_AGE,
  fetchUser: (accountId: string): Promise<User> => {
    const aaid = uncurlyAaid(accountId) || accountId;
    const url = urls.api.v20.user(aaid);
    return fetch(
      authRequest(`${url}?${identityFieldQuery}`, { headers: jsonHeaders })
    ).then(response => {
      return response.ok ? response.json() : Promise.reject();
    });
  },
  onError,
});
