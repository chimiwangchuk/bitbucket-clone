/* eslint-disable no-underscore-dangle */
// @ts-ignore TODO: fix noImplicitAny error here
import qs from 'query-string';
import {
  onEmitAcceptOrDeny,
  onAcceptOrDenyAsync,
  AcceptOrDenyOptions,
} from '../oauth';
import request from '../request';
import { getModules, getFilter } from '../modules';
import * as EditorAPI from '../editor';
import { getObjectValue, isFunction } from '../../utils';
import * as errors from '../errors';
import { linkerTargetSelfLink } from '../links/utils';
import * as $ from '../../types';
import { fetchCachedRequest, TIME_CACHED } from './requestCache';

const { errorResponse } = errors;

/**
 * The AddonManager class manages caching and fetching for connect modules.
 */
export class AddonManager {
  env: $.ConnectEnv = {};
  currentUser: $.ConnectUser = {};
  modules: Map<string, $.ConnectModule> = new Map();
  targets: Map<
    string,
    { principalId: string; target: $.ConnectTarget }
  > = new Map();
  editor: any = EditorAPI;
  buffer: number;
  // these need to be set by host application
  _managePermissionsUrlProvider: () => string = () => '/';
  // these are undefined and need to be set by host application
  _denyOAuthConsumer:
    | ((moduleId: string, onSuccess: any, onError: any) => any)
    | null = null;
  _grantOAuthConsumer:
    | ((options: AcceptOrDenyOptions, isGranted: boolean) => any)
    | null = null;
  _getOAuthScopes: (onSuccess: Function, onError: Function) => any;

  setEnv(env: $.ConnectEnv) {
    this.env = env;
  }
  setCurrentUser(currentUser: $.ConnectUser): void {
    this.currentUser = currentUser;
  }
  addModule(
    mod: $.ConnectModuleBase,
    target: $.ConnectTarget,
    principalId?: $.ConnectModulePrincipalId
  ): boolean {
    const addonKey = mod.app_key;
    const moduleKey = getObjectValue(mod, 'descriptor.key');
    let targetHref: string = getObjectValue(target, 'links.self.href', '');
    if (!targetHref && target.type === 'internal_linker_match') {
      targetHref = linkerTargetSelfLink(target, principalId);
      // eslint-disable-next-line no-param-reassign
      target = {
        ...target,
        links: { self: { href: targetHref } },
      };
    }
    if (!addonKey || !moduleKey || !targetHref) {
      return false;
    }
    const id = `${addonKey}_${moduleKey}_${targetHref}`;

    // If the module has already been added and is not expired,
    // don't add again as we check object references to prevent rerender
    const existingModule = this.findModules({ moduleId: id })[0];
    if (existingModule && !this.isModuleExpired(existingModule)) {
      return false;
    }

    const now = Date.now();
    if (principalId && !this.targets.has(targetHref)) {
      this.targets.set(targetHref, { principalId, target });
    }
    return !!this.modules.set(id, {
      ...mod,
      id,
      targetHref,
      fetchedAt: now,
      tokenIssuedAt: mod.options['access-token'] ? now : 0,
      principalId,
    });
  }
  removeModule(id: string): boolean {
    return this.modules.delete(id);
  }
  removeModules(): void {
    this.targets.clear();
    this.modules.clear();
  }
  isModuleExpired(mod: $.ConnectModule): boolean {
    return mod.fetchedAt + TIME_CACHED <= Date.now();
  }
  getAll(): $.ConnectModule[] {
    return Array.from(this.modules.values());
  }
  findModules(...filters: $.ConnectModuleCredentials[]): $.ConnectModule[] {
    return getModules(this.getAll(), ...filters);
  }
  hasExpiredModule(...filters: $.ConnectModuleCredentials[]): boolean {
    return this.findModules(...filters).some(this.isModuleExpired);
  }
  filterModules(...filters: $.ConnectModuleCredentials[]): $.ConnectModule[] {
    return this.findModules(...filters).filter(m => !this.isModuleExpired(m));
  }

  /**
   * Gets modules from the cache if they are not expired. If some are expired, it will filter out those
   * modules and send a request to the Modules API to fetch them. After the fetch is complete, the cache
   * is updated and the original request completed.
   * @param {string} principalId - the principal account the module is installed on.
   * @param {Array} requests - an array of ConnectModuleRequest objects.
   */
  async getModules(
    principalId: $.ConnectModulePrincipalId,
    ...requests: $.ConnectModuleRequest[]
  ): Promise<any> {
    const responses = await this.fetchModules(principalId, ...requests);
    // @ts-ignore TODO: fix noImplicitAny error here
    responses.forEach(({ target, modules }) =>
      // @ts-ignore TODO: fix noImplicitAny error here
      modules.forEach(m => this.addModule(m, target, principalId))
    );

    return getModules(
      this.getAll(),
      ...requests.reduce((a, r) => {
        return [...a, ...r.modules.map(c => getFilter(c, r.target))];
      }, [])
    );
  }

  /**
   * Fetches modules directly from the modules API. If any appKey or moduleKey is contained within
   * the request object array, they will be appended as url params. The function also caches a reference
   * to the request and concatenates subsequent requests with the same url as to avoid duplicate requests.
   * @param {string} principalId - the principal account the module is installed on.
   * @param {Array} requests - an array of ConnectModuleRequest objects.
   */
  // eslint-disable-next-line require-await
  async fetchModules(
    principalId: $.ConnectModulePrincipalId,
    ...requests: $.ConnectModuleRequest[]
  ): Promise<any> {
    const params: { app_key?: string[]; module_key?: string[] } = {};
    const body: $.ConnectModuleRequestRaw[] = [];
    requests.forEach(({ target, modules }) => {
      const _modules: string[] = [];
      modules.forEach(({ appKey, moduleKey, moduleType, location }) => {
        if (
          appKey &&
          (!params.app_key || !params.app_key.some(v => v === appKey))
        ) {
          params.app_key = params.app_key || [];
          params.app_key.push(appKey);
        }
        if (
          moduleKey &&
          (!params.module_key || !params.module_key.some(v => v === moduleKey))
        ) {
          params.module_key = params.module_key || [];
          params.module_key.push(moduleKey);
        }
        if (moduleType) {
          _modules.push(location ? `${moduleType}:${location}` : moduleType);
        }
      });
      body.push({
        target,
        modules: _modules,
      });
    });

    let url = `/!api/internal/connect/modules/${principalId}`;
    if (Object.keys(params).length > 0) {
      url = `${url}?${qs.stringify(params)}`;
    }
    return fetchCachedRequest(url, body);
  }

  /**
   * Gets an authentication token from modules API reponse by moduleId. If it is expired,
   * a new token will be requested the cache will be updated.
   * @param {string} id - moduleId (combination of appKey, moduleKey & targetHref)
   * @param {boolean} forceUpdate - forces cache to get new token from API
   */
  async getToken(
    id: string,
    forceUpdate?: boolean
  ): Promise<$.OAuth2AccessToken | $.OAuth2AccessTokenError> {
    const mod = this.modules.get(id);
    if (!mod) {
      throw errorResponse(errors.MODULE_NOT_FOUND);
    }
    const {
      app_name: appName,
      options: {
        'client-id': clientId,
        'user-denied': userDenied,
        'access-token': accessToken,
        'callback-url': callbackUrl,
        'access-token-expires-in': accessTokenExpiresIn,
        scopes,
      },
      tokenIssuedAt,
    } = mod;

    if (!this.currentUser.isAuthenticated) {
      if (!accessToken) {
        // If the user is not authenticated and there is no accessToken, assume public access, else throw error.
        return {
          access_token: '',
          expires_in: 0,
          scopes: '',
          token_type: '',
          unauthenticated: true,
        };
      }
      throw errorResponse(errors.USER_NOT_AUTHENTICATED);
    }
    if (!clientId) {
      throw errorResponse(errors.NO_OAUTH_CONSUMER_CLIENT_ID);
    }
    if (String(userDenied) === 'true') {
      throw errorResponse(errors.USER_ALREADY_DENIED_ACCESS);
    }

    let acceptOrDeny;
    const acceptOrDenyOptions = {
      moduleId: id,
      name: appName,
      scopes,
    };
    if (!accessToken) {
      // The only reason you should hit this code path is
      // if the addon includes an oauthConsumer in the descriptor
      acceptOrDeny = await onAcceptOrDenyAsync(acceptOrDenyOptions);
      if (!acceptOrDeny.accepted) {
        throw errorResponse(errors.USER_DENIED_ACCESS);
      }
    }

    const modules = Array.from(document.querySelectorAll('iframe'));
    const iframe = modules.find(({ src }) => src.startsWith(callbackUrl));
    if (!iframe) {
      throw errorResponse(errors.FRAME_SRC_CONSUMER_CALLBACK_MISMATCH);
    }

    if (accessToken && !forceUpdate) {
      const tokenExpiresIn = accessTokenExpiresIn * 1000;
      const tokenExpiresAt = tokenIssuedAt + tokenExpiresIn - 3000; // 3000ms buffer time for token expiry
      if (tokenExpiresAt > Date.now()) {
        return {
          access_token: accessToken,
          expires_in: accessTokenExpiresIn,
          scopes,
          token_type: 'bearer',
        };
      }
    }
    const params = {
      client_id: clientId,
      grant_type: 'urn:bitbucket:oauth2:session',
      redirect_uri: iframe.src,
      // This (disallow_creation) by default will be set to true. The only reason it should
      // be set to false is if the connect app is using an OAuthConsumer in their descriptor.
      // When set to false, it will give the requesting app permission (a token) so it can
      // make requests over the bridge using AP.request.
      disallow_creation: !acceptOrDeny || !acceptOrDeny.accepted,
    };

    const response = await fetch(
      request('/site/oauth2/access_token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: qs.stringify(params),
      })
    );

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      if (!response.ok) {
        if (acceptOrDeny) {
          this.grantOAuthConsumer(acceptOrDenyOptions, false);
        }
        throw await response.json();
      }
      const data: $.OAuth2AccessToken = await response.json();
      const _mod = this.modules.get(id);
      if (!_mod) {
        throw errorResponse(errors.MODULE_NOT_FOUND);
      }
      if (acceptOrDeny) {
        this.grantOAuthConsumer(acceptOrDenyOptions, true);
      }
      const options = {
        ..._mod.options,
        'access-token': data.access_token,
        'access-token-expires-in': data.expires_in,
      };
      this.modules.set(_mod.id, {
        ..._mod,
        options,
        tokenIssuedAt: Date.now(),
      });
      // don't send refresh token
      const { refresh_token: _, ...res } = data;
      return res;
    }
    if (acceptOrDeny) {
      this.grantOAuthConsumer(acceptOrDenyOptions, false);
    }
    throw errorResponse(errors.INVALID_RESPONSE, response.statusText);
  }

  /**
   * The following functions provide getters/setters for handling lecacy oauth
   * flows within connect apps. Ideally this would live in a seperate class called OAuth.
   * For now it has been added to the AddonManager.
   */

  /**
   * Expose function to attach event hander that listens to OAuth emit event.
   */
  handleOAuthAcceptOrDeny = onEmitAcceptOrDeny;

  /**
   * Setters for OAuth conusmer handlers
   */
  setDenyOAuthHandler(
    fn: ((moduleId: string, onSuccess: any, onError: any) => any) | null
  ) {
    this._denyOAuthConsumer = fn;
  }
  setGrantOAuthHandler(
    fn: ((options: AcceptOrDenyOptions, isGranted: boolean) => any) | null
  ) {
    this._grantOAuthConsumer = fn;
  }

  /**
   * Get for OAuth conusmer handlers
   */
  setOAuthScopesHandler(fn: (onSuccess: any, onError: any) => any) {
    this._getOAuthScopes = fn;
  }
  getOAuthScopes(onSuccess: any, onError: any) {
    if (!isFunction(this._getOAuthScopes)) {
      throw new Error(
        'getOAuthScopes() must be set by setOAuthScopesHandler()'
      );
    }
    return this._getOAuthScopes(onSuccess, onError);
  }

  /**
   * The setManagePermissionsUrlProvider is used by the UI to show a link onSuccess
   * that will take the user to manage page.
   */
  setManagePermissionsUrlProvider(provider: () => string) {
    this._managePermissionsUrlProvider = provider;
  }
  getManagePermissionsUrl(): string {
    if (!isFunction(this._managePermissionsUrlProvider)) {
      throw new Error(
        'managePermissionsUrlProvider() must be set by setManagePermissionsUrlProvider()'
      );
    }
    return this._managePermissionsUrlProvider();
  }

  /**
   * In the legacy oauth access token flow we show a dialog to allow
   * the user to approve or deny scopes. This denyOAuthConsumer() enables
   * the host to set the behaviour that is triggered when the user denies the
   * app access to their account, which at this point in time should result in a PUT
   * to the /internal/consumers/<client id>/denials API.
   */
  denyOAuthConsumer(moduleId: string, onSuccess: any, onError: any) {
    if (!isFunction(this._denyOAuthConsumer)) {
      throw new Error(
        'denyOAuthConsumer() must be set by setDenyOAuthHandler()'
      );
      // eslint-disable-next-line no-unreachable
      return;
    }
    this._denyOAuthConsumer(moduleId, onSuccess, onError);
  }

  /**
   * In the legacy oauth access token flow we show a dialog to allow
   * the user to approve or deny scopes, and if the access token request fails
   * we need to replace that UI with the appropriate error flag,
   * which we trigger by calling grantOauthConsumer() with args to
   * indicate success or failure.
   */
  grantOAuthConsumer(options: AcceptOrDenyOptions, isGranted: boolean) {
    if (!isFunction(this._grantOAuthConsumer)) {
      return;
    }
    this._grantOAuthConsumer(options, isGranted);
  }
}

export default new AddonManager();
