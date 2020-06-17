import { ConnectModuleCredentials, NodeCallback } from '../types';
import { getObjectValue } from '../utils';
import AddonManager from './addonManager';
import * as errors from './errors';

export interface AccessTokenRequest {
  credentials: ConnectModuleCredentials;
  forceUpdate?: boolean;
}

export function requestAccessToken(
  request: AccessTokenRequest | ConnectModuleCredentials,
  cb: NodeCallback & { _context?: any }
) {
  let moduleId: string | undefined;
  let forceUpdate: boolean | undefined;
  // for backwards compatability we need to handle different object types
  if ('credentials' in request) {
    // eslint-disable-next-line prefer-destructuring
    moduleId = request.credentials.moduleId;
    // eslint-disable-next-line prefer-destructuring
    forceUpdate = request.forceUpdate;
  } else {
    // eslint-disable-next-line prefer-destructuring
    moduleId = request.moduleId;
  }
  // atlassian connect attaches context to the callback
  // we can use that to verify moduleId's match
  // eslint-disable-next-line no-underscore-dangle
  const modId = getObjectValue(cb._context, 'extension.options.moduleId');
  if (moduleId !== modId) {
    cb(errors.errorResponse(errors.USER_DENIED_ACCESS), null);
  } else if (moduleId) {
    AddonManager.getToken(moduleId, forceUpdate)
      .then(data => cb(null, data))
      .catch(error => cb(error, null));
  }
}

export function getHostEnv(cb: NodeCallback) {
  const element = document.querySelector('meta[name="bb-api-canon-url"]');
  if (!element) {
    cb('"bb-api-canon-url" element not found on page.');
    return;
  }
  cb(null, { baseApiUrl: element.getAttribute('content') });
}

export function getProxyEnv(
  { moduleId }: ConnectModuleCredentials,
  cb: NodeCallback
) {
  if (!moduleId) {
    return;
  }
  const mod = AddonManager.modules.get(moduleId);
  if (!mod) {
    cb(`ConnectModule not found: ${moduleId}`);
    return;
  }
  cb(null, { baseApiUrl: mod.options['proxy-base-api-url'] });
}

export function getCurrentUser(cb: NodeCallback) {
  const element = document.getElementById('bb-bootstrap');
  if (!element) {
    return cb('"bb-bootstrap" element not found on page.');
  }
  try {
    const currentUser = element.getAttribute('data-current-user');
    if (!currentUser) {
      return cb('"bb-bootstrap" element not found on page.');
    }
    return cb(null, JSON.parse(currentUser));
  } catch (error) {
    return cb(error);
  }
}
