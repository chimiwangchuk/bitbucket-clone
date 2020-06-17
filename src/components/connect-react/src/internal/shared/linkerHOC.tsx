import * as React from 'react';
import { AddonManager, ConnectModule } from '@atlassian/bitbucket-connect-js';
import ConnectModules from '../modules';
import { linkerTarget, LinkerTargetProps } from '../shared/linkerTarget';
import { getObjectValue } from '../../main/utils';

export type LinkerExtension = LinkerTargetProps & {
  addon_key: string;
  key: string;
  options: any;
};

export interface LinkerProps {
  addonManager: typeof AddonManager;
  extension: LinkerExtension;
  options: any;
  onChange?: (data: any) => any;
}

function extractOptions(
  modules: ConnectModule[],
  opts: any,
  addonManager: typeof AddonManager
) {
  let mod: Partial<ConnectModule> = {};
  let extension = {};
  let options = {};
  if (modules.length) {
    mod = modules[0];
    const {
      app_key: addonKey,
      descriptor: { key } = { key: '' },
      targetHref = '',
    } = mod;
    const target = addonManager.targets.get(targetHref);
    if (target) {
      options = {
        ...opts,
        ...getObjectValue(target, 'target.module.descriptor.target.options'),
      };
      extension = { key, addon_key: addonKey, targetHref };
    }
  }
  return { module: mod, extension, options };
}

export default function LinkerHOC<P extends LinkerProps>(
  Component: React.ComponentType<P>
) {
  return (props: P & LinkerProps) => {
    const { addonManager, extension, options, onChange } = props;
    const { principalId, addon_key: appKey, key: moduleKey } = extension;
    const updater =
      onChange &&
      // @ts-ignore TODO: fix noImplicitAny error here
      (({ modules }) =>
        modules.length > 0 &&
        onChange(extractOptions(modules, options, addonManager)));
    return (
      <ConnectModules
        principalId={principalId}
        onMount={updater}
        onUpdate={updater}
        query={[
          {
            modules: [{ appKey, moduleKey }],
            target: linkerTarget(extension),
          },
        ]}
      >
        {({ modules }) => {
          if (modules.length) {
            return (
              <Component
                {...props}
                {...extractOptions(modules, options, addonManager)}
                query={[]}
              />
            );
          }
          return false;
        }}
      </ConnectModules>
    );
  };
}
