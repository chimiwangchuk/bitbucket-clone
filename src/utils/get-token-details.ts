import * as Sentry from '@sentry/browser';
import store from 'src/utils/store';
import refreshToken from './refresh-token';

export type BitbucketApiClientOptions = {
  token: string | null | undefined;
  expiration: number | null | undefined;
};

const TOKEN_EXPIRY_THRESHOLD = 30000;

// We use performance.now() instead of Date.now() because it's monotonic.
// i.e. it doesn't depend on the user’s time setting which could change
// between when we calculate the expiration and later when we check if
// the token has expired.
// eslint-disable-next-line compat/compat
const TOKEN_EXPIRATION_FROM = performance.now();

function anonymousToken() {
  const tokenDetails: BitbucketApiClientOptions = {
    token: null,
    expiration: null,
  };

  return tokenDetails;
}

function parseTokenDetailsFromMetaTag(expiresDurationInApiToken: boolean) {
  const tokenMetaTag = document.querySelector('meta[name=apitoken]');

  const rawTokenDetails =
    tokenMetaTag && tokenMetaTag.hasAttribute('content')
      ? tokenMetaTag.getAttribute('content')
      : null;

  if (rawTokenDetails) {
    try {
      const tokenDetails = JSON.parse(rawTokenDetails);

      if (expiresDurationInApiToken) {
        // convert tokenDetails expiration to milliseconds
        if (tokenDetails.expires_in !== undefined) {
          tokenDetails.expiration =
            TOKEN_EXPIRATION_FROM + tokenDetails.expires_in * 1000;
        }
      } else {
        // convert tokenDetails expiration to milliseconds
        if (tokenDetails.expiration) {
          tokenDetails.expiration *= 1000;
        }
      }

      return tokenDetails;
    } catch (ignore) {
      return anonymousToken();
    }
  }

  return anonymousToken();
}

// This function compares the expiration of the token that we extracted from
// the meta tag with the token in local storage. It then updates local
// storage with the latest token and returns the latest token.
function getLatestToken(
  userUuid: string,
  tokenFromMetaTag: BitbucketApiClientOptions
) {
  const tokenStored = store.get(`api-token-data:${userUuid}`);
  let latestToken;

  Sentry.addBreadcrumb({
    category: 'token',
    message: `API token in local storage for user ${userUuid} has expiration ${tokenStored?.expiration}`,
    level: Sentry.Severity.Info,
  });

  if (tokenStored && tokenStored.expiration && tokenFromMetaTag.expiration) {
    if (tokenStored.expiration > tokenFromMetaTag.expiration) {
      // The stored token is newer than the token from meta tag
      Sentry.addBreadcrumb({
        category: 'token',
        message: `API token in local storage is newer than the token from meta tag`,
        level: Sentry.Severity.Info,
      });
      latestToken = tokenStored;
    } else {
      // Update the store with the newer token from meta tag
      Sentry.addBreadcrumb({
        category: 'token',
        message: `API token from meta tag is newer than the token in local storage`,
        level: Sentry.Severity.Info,
      });
      store.set(`api-token-data:${userUuid}`, tokenFromMetaTag);
      latestToken = tokenFromMetaTag;
    }
  } else if (!tokenStored && tokenFromMetaTag.expiration) {
    // No stored token and the token from meta tag is NOT the anonymous token
    Sentry.addBreadcrumb({
      category: 'token',
      message: `No API token in local storage and the token from meta tag is NOT the anonymous token`,
      level: Sentry.Severity.Info,
    });
    store.set(`api-token-data:${userUuid}`, tokenFromMetaTag);
    latestToken = tokenFromMetaTag;
  } else if (tokenStored && !tokenFromMetaTag.expiration) {
    // Stored token and the token from meta tag is the anonymous token
    Sentry.addBreadcrumb({
      category: 'token',
      message: `API token in local storage and the token from meta tag is the anonymous token`,
      level: Sentry.Severity.Info,
    });
    latestToken = tokenStored;
  } else {
    // No stored token and the token from meta tag is the anonymous token
    Sentry.addBreadcrumb({
      category: 'token',
      message: `No API token in local storage and the token from meta tag is the anonymous token`,
      level: Sentry.Severity.Info,
    });
    latestToken = tokenFromMetaTag;
  }

  return latestToken;
}

function isExpired(
  tokenDetails: BitbucketApiClientOptions,
  expiresDurationInApiToken: boolean
) {
  // The token is expired if now is after (>) the expiration time.
  // We include a threshold so that we refresh the token before it
  // actually expires.

  if (expiresDurationInApiToken) {
    return (
      !tokenDetails.expiration ||
      // We use performance.now() instead of Date.now() because it's monotonic.
      // i.e. it doesn't depend on the user’s time setting which could change
      // between when we calculate the expiration and later when we check if
      // the token has expired.
      // eslint-disable-next-line compat/compat
      performance.now() + TOKEN_EXPIRY_THRESHOLD > tokenDetails.expiration
    );
  }

  return (
    !tokenDetails.expiration ||
    Date.now() + TOKEN_EXPIRY_THRESHOLD > tokenDetails.expiration
  );
}

export const getTokenDetails = async (
  userUuid?: string,
  expiresDurationInApiToken = false
) => {
  // Anonymous users have no token
  if (!userUuid) {
    Sentry.addBreadcrumb({
      category: 'token',
      message: `Returning anonymous API token`,
      level: Sentry.Severity.Info,
    });
    return anonymousToken();
  }

  const tokenFromMetaTag = parseTokenDetailsFromMetaTag(
    expiresDurationInApiToken
  );

  Sentry.addBreadcrumb({
    category: 'token',
    message: `API token from meta tag for user ${userUuid} has expiration ${tokenFromMetaTag?.expiration}`,
    level: Sentry.Severity.Info,
  });

  const latestToken = getLatestToken(userUuid, tokenFromMetaTag);

  Sentry.addBreadcrumb({
    category: 'token',
    message: `Latest API token for user ${userUuid} has expiration ${latestToken?.expiration}`,
    level: Sentry.Severity.Info,
  });

  if (isExpired(latestToken, expiresDurationInApiToken)) {
    const refreshedToken = await refreshToken(
      latestToken,
      expiresDurationInApiToken
    );
    store.set(`api-token-data:${userUuid}`, refreshedToken);

    Sentry.addBreadcrumb({
      category: 'token',
      message: `Refreshed API token for user ${userUuid} has expiration ${refreshedToken?.expiration}`,
      level: Sentry.Severity.Info,
    });

    return refreshedToken;
  }

  return latestToken;
};

// @ts-ignore TODO: fix noImplicitAny error here
export const getAuthHeader = options => {
  // Anonymous user have no token
  if (!options.token) {
    return {};
  }

  return {
    Authorization: `Bearer ${options.token ? options.token : ''}`,
  };
};
