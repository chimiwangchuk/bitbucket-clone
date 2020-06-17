import React from 'react';
import { ConnectWebItemProps } from '../';
import InlineDialogIframe from '../../../internal/inlineDialog/inlineDialogIframe';

export default (props: ConnectWebItemProps) => {
  const { component, providers, module: mod, analyticsEventHandler } = props;
  if (!mod) {
    return false;
  }
  const {
    app_key: appKey,
    module_type: moduleType,
    source: { url },
    descriptor: {
      key,
      location,
      name: { value: name = '' } = {},
      target: { options = {} } = {},
    },
    principalId,
  } = mod;
  const provider = providers.inlineDialogProvider.create(key, options);
  const { tooltip, onHover } = options;
  const externalTargetUrl = options.externalTargetUrl || url;
  // @ts-ignore TODO: fix noImplicitAny error here
  const onClick = e => {
    e.preventDefault();
    if (!onHover) {
      provider.toggle();
      if (analyticsEventHandler) {
        analyticsEventHandler(
          'bitbucket.connect.web_item_inline_dialog.click',
          {
            principal_id: principalId,
            app_key: appKey,
            module_key: key,
            module_type: moduleType,
            location,
            description: name,
          }
        );
      }
    }
  };
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <InlineDialogIframe {...props} provider={provider}>
        {!component ? (
          <a href={externalTargetUrl} title={tooltip} onClick={onClick}>
            {name}
          </a>
        ) : (
          React.createElement(
            component,
            { module: mod, provider, externalTargetUrl, onClick },
            name
          )
        )}
      </InlineDialogIframe>
    </span>
  );
};
