import fetchAccessToken from 'src/utils/fetch-access-token';
import { BitbucketApiClientOptions } from 'src/utils/get-token-details';

export default async function refreshToken(
  options: BitbucketApiClientOptions,
  expiresDurationInApiToken: boolean
) {
  let newOptions = { ...options };
  try {
    const accessToken = await fetchAccessToken('site:JSAPITOKEN');
    newOptions.token = accessToken.token;

    if (expiresDurationInApiToken) {
      newOptions.expiration =
        // We use performance.now() instead of Date.now() because it's monotonic.
        // i.e. it doesn't depend on the user’s time setting which could change
        // between when we calculate the expiration and later when we check if
        // the token has expired.
        // eslint-disable-next-line compat/compat
        performance.now() + accessToken.expiresInSeconds * 1000;
    } else {
      newOptions.expiration = Date.now() + accessToken.expiresInSeconds * 1000;
    }
  } catch {
    newOptions = {
      token: null,
      expiration: null,
    };
  }
  return newOptions;
}
