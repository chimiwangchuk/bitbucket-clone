import React from 'react';
import { ConnectWebItemProps } from '../';
import { DialogAction } from '../../../internal/dialog/dialog';

export default ({
  component,
  providers: { dialogProvider },
  analyticsEventHandler,
  module: mod,
}: ConnectWebItemProps) => {
  if (!mod) {
    return false;
  }
  const {
    app_key: appKey,
    module_type: moduleType,
    source: { url },
    targetHref,
    principalId,
    descriptor: {
      key: moduleKey,
      location,
      name: { value: name = '' } = {},
      target = {},
    },
  } = mod;
  const options = target.options || {};
  let actions: DialogAction[] = [];
  options.chrome = !(String(options.chrome) === 'false');
  const externalTargetUrl = options.externalTargetUrl || url;

  if (options.chrome) {
    actions = [
      {
        key: 'cancel',
        name: 'cancel',
        identifier: 'cancel',
        text: 'Close',
        type: 'link',
        immutable: true,
        onClick: () => dialogProvider.close(),
      },
    ];
  }

  // @ts-ignore TODO: fix noImplicitAny error here
  const onClick = e => {
    e.preventDefault();
    dialogProvider.create(
      Object.assign({
        key: moduleKey,
        header: options.chrome ? name : '',
        actions,
        closeOnEscape: true,
        hint: '',
        ...options,
      }),
      {
        key: moduleKey,
        addon_key: appKey,
        moduleType,
        location,
        targetHref,
        options: {},
      }
    );
    if (analyticsEventHandler) {
      analyticsEventHandler('bitbucket.connect.web_item_dialog.click', {
        principal_id: principalId,
        app_key: appKey,
        module_key: moduleKey,
        module_type: moduleType,
        location,
        description: name,
      });
    }
  };

  if (component) {
    return React.createElement(
      component,
      { module: mod, externalTargetUrl, provider: dialogProvider, onClick },
      name
    );
  }
  return (
    <a href={externalTargetUrl} title={options.tooltip} onClick={onClick}>
      {name}
    </a>
  );
};
