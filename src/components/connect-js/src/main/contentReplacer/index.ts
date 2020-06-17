import AddonManager from '../addonManager';
import { ConnectModuleCredentials, NodeCallback } from '../../types';
import { emitter, REPLACE_CONTENT_EVENT } from './emitter';

export function replaceContent(
  moduleKey: string,
  credentials: ConnectModuleCredentials,
  cb: NodeCallback
) {
  if (credentials && credentials.targetHref) {
    const source = AddonManager.targets.get(credentials.targetHref);
    const mods = AddonManager.filterModules({
      appKey: credentials.appKey,
      moduleType: 'associatedAddon',
      targetHref: credentials.targetHref,
    });
    if (source && mods.length) {
      const mod = mods[0];
      AddonManager.getModules(source.principalId, {
        target: source.target,
        modules: [
          {
            appKey: mod.descriptor.key,
            moduleKey,
            moduleType: credentials.moduleType,
            location: credentials.location,
          },
        ],
      })
        .then(modules => emitter.emit(REPLACE_CONTENT_EVENT, ...modules))
        .catch(error => cb(error));
    }
  }
}
