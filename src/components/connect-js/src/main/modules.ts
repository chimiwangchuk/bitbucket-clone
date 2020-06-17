import { isString, getObjectValue } from '../utils';
import {
  ConnectModule,
  ConnectTarget,
  ConnectModuleCredentials,
} from '../types';

function matchModule(
  {
    id,
    app_key: akey,
    module_type: type,
    descriptor: { key, location: loc },
    targetHref: href,
  }: ConnectModule,
  {
    moduleType,
    moduleKey,
    moduleId,
    appKey,
    targetHref,
    location,
  }: ConnectModuleCredentials
): boolean {
  return (
    (!moduleId || moduleId === id) &&
    (!appKey || appKey === akey) &&
    (!moduleKey || moduleKey === key) &&
    (!targetHref || targetHref === href) &&
    (!moduleType ||
      (isString(moduleType) &&
        moduleType.toLowerCase() === type.toLowerCase())) &&
    (!location || location === loc)
  );
}

export function getModules(
  modules: ConnectModule[],
  ...filters: ConnectModuleCredentials[]
): ConnectModule[] {
  return filters.length
    ? modules.filter(m => filters.some(f => matchModule(m, f)))
    : [];
}

export function getFilter(
  cred: ConnectModuleCredentials,
  target: ConnectTarget
): ConnectModuleCredentials {
  return {
    moduleType: cred.moduleType,
    moduleKey: cred.moduleKey,
    moduleId: cred.moduleId,
    appKey: cred.appKey,
    targetHref: cred.targetHref || getObjectValue(target, 'links.self.href'),
    location: cred.location,
  };
}
