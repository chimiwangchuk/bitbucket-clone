import URL from 'url';
import { get } from 'lodash-es';
import qs from 'qs';

type StateKey = string | string[];

export function getStateFromKey(state: object, stateKey: StateKey) {
  const location = Array.isArray(stateKey)
    ? stateKey.find(sl => get(state, sl))
    : stateKey;

  return {
    data: get(state, location || ''),
    location,
  };
}

export function isSectionKey(stateKey: StateKey) {
  // Test if this key belongs to global/section state
  const sectionRegex = /^section\./;
  if (Array.isArray(stateKey)) {
    return stateKey.some(key => sectionRegex.test(key));
  }
  return sectionRegex.test(stateKey);
}

export function urlWithState(url: string, stateKey: StateKey): string {
  // Add `state=view` or `state=section` query parameter to the URL without
  // clobbering existing query params
  const urlObj = URL.parse(url);
  const search = qs.parse(urlObj.query || '');
  search.state = isSectionKey(stateKey) ? 'section' : 'view';

  return URL.format({
    ...urlObj,
    search: qs.stringify(search),
  });
}
