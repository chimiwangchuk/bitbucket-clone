import qs from 'qs';
import escape from 'lodash-es/escape';

import urls from 'src/urls';

export const buildSocialAuthLink = (login: string) => {
  const search = {
    next: '/',
    chosen_aid: `not:${login}`,
  };

  return escape(`${urls.external.socialAuthLink}?${qs.stringify(search)}`);
};
