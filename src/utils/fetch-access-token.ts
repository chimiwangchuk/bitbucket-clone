import qs from 'qs';

import settings from 'src/settings';
import authRequest from 'src/utils/fetch';

type AccessToken = {
  token: string;
  expiresInSeconds: number;
};

export default function(clientId: string): Promise<AccessToken> {
  const requestData = {
    client_id: clientId,
    redirect_uri: 'https://bitbucket.org/',
    grant_type: 'urn:bitbucket:oauth2:session',
  };

  return fetch(
    authRequest(`${settings.CANON_URL}/site/oauth2/access_token`, {
      method: 'POST',
      body: qs.stringify(requestData),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  )
    .then(response =>
      response.ok ? response.json() : Promise.reject(response)
    )
    .then(json => ({
      expiresInSeconds: json.expires_in,
      token: json.access_token,
    }));
}
