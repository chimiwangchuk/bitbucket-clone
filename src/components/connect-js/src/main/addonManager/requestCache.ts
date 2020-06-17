// @ts-ignore TODO: fix noImplicitAny error here
import cloneDeep from 'lodash.clonedeep';
import * as errors from '../errors';
import * as $ from '../../types';
import { fetchData, bodyMatches, addModulesToBody } from './utils';

const { errorResponse } = errors;

/**
 * This type tracks pending requests. Enables deduping
 * and parallel requests to be grouped.
 */
export type Request = {
  url: string;
  body: $.ConnectModuleRequestRaw[];
  response?: Promise<$.ConnectModuleResponse>;
  fetchedAt?: number;
  requesting?: boolean;
  resolved?: boolean;
};

/**
 * Private vars used by request cache
 */
// eslint-disable-next-line no-underscore-dangle
const _cache: Request[] = [];
export const REQUEST_BUFFER = 15; // 15ms wait for other requests with same url
export const TIME_CACHED = 270000; // responses timeout after 4.5 mins

export function getCachedRequest(request: Request): Request | void {
  return _cache.find(
    req => req.url === request.url && bodyMatches(request.body, req.body)
  );
}

export function setCachedRequest(request: Request): Request {
  const index = _cache.findIndex(
    req => req.url === request.url && bodyMatches(request.body, req.body)
  );
  if (index > -1) {
    _cache.splice(index, 1, cloneDeep(request));
  } else {
    _cache.push(cloneDeep(request));
  }
  return request;
}

export function deleteCachedRequest(request: Request): boolean {
  const index = _cache.findIndex(
    req => req.url === request.url && bodyMatches(request.body, req.body)
  );
  if (index > -1) {
    _cache.splice(index, 1);
    return true;
  }
  return false;
}

export function emptyCache(): void {
  _cache.splice(0, _cache.length);
}

// eslint-disable-next-line require-await
export async function fetchCachedRequest(
  url: string,
  body: $.ConnectModuleRequestRaw[]
) {
  let request = getCachedRequest({ url, body });
  if (request) {
    if (
      request.resolved &&
      Date.now() >= (request.fetchedAt || 0) + TIME_CACHED
    ) {
      // clear cache as expired
      deleteCachedRequest(request);
      request = undefined;
    } else {
      return request.response;
    }
  }

  request = _cache.find(
    req => req.url === url && !req.requesting && !req.resolved
  );
  if (request) {
    request.body = addModulesToBody(request.body, body);
  }

  if (!request) {
    request = setCachedRequest({
      url,
      body,
      response: (async () => {
        await new Promise(resolve => setTimeout(resolve, REQUEST_BUFFER));
        const req = getCachedRequest({ url, body });
        if (req) {
          setCachedRequest({ ...req, requesting: true });
          const response = await fetchData(req.url, req.body);
          setCachedRequest({
            ...req,
            requesting: false,
            resolved: true,
            fetchedAt: Date.now(),
          });
          return response;
        }
        throw errorResponse(errors.INVALID_RESPONSE);
      })(),
    });
  }

  if (request && request.response) {
    return request.response;
  }

  throw errorResponse(errors.INVALID_RESPONSE);
}
