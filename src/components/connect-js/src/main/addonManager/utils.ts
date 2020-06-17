import request from '../request';
import { getObjectValue } from '../../utils';
import * as errors from '../errors';
import { ConnectModuleRequestRaw, ConnectModuleResponse } from '../../types';

const { errorResponse } = errors;

/**
 * Fetches data from the modules API and handles the response
 * @param {string} url
 * @param {Array} body
 */
export async function fetchData(
  url: string,
  body: ConnectModuleRequestRaw[]
): Promise<ConnectModuleResponse> {
  const response = await fetch(
    request(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    })
  );
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    if (!response.ok) {
      throw await response.json();
    }
    const data = await response.json();
    if (!data) {
      throw errorResponse(errors.MODULE_NOT_FOUND);
    }
    return data;
  }
  throw errorResponse(errors.INVALID_RESPONSE);
}

/**
 * Checks that all requested modules in body1 exist in body2
 * @param {Array} body1
 * @param {Array} body2
 */
export function bodyMatches(
  body1: ConnectModuleRequestRaw[],
  body2: ConnectModuleRequestRaw[]
): boolean {
  return body1.every(({ target, modules }) => {
    const targetHref = getObjectValue(target, 'links.self.href');
    return body2.some(({ target: _target, modules: _modules }) => {
      const selfHref = getObjectValue(_target, 'links.self.href');
      return (
        targetHref === selfHref && modules.every(m => _modules.includes(m))
      );
    });
  });
}

/**
 * Adds modules from body2 into body1 if they dont already exist
 * @param {Array} body1
 * @param {Array} body2
 */
export function addModulesToBody(
  body1: ConnectModuleRequestRaw[],
  body2: ConnectModuleRequestRaw[]
) {
  // eslint-disable-next-line no-param-reassign
  body1 = [...body1];
  body2.forEach(item => {
    const { target, modules } = item;
    const targetHref = getObjectValue(target, 'links.self.href');
    const foundIndex = body1.findIndex(
      ({ target: t }) => targetHref === getObjectValue(t, 'links.self.href')
    );
    if (foundIndex > -1) {
      const mods = body1[foundIndex].modules;
      body1[foundIndex].modules = [...new Set(mods.concat(modules))];
    } else {
      body1.push(item);
    }
  });
  return body1;
}
