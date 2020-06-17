import React from 'react';
import { ConnectWebItemProps } from '../';

export default ({ component, module: mod }: ConnectWebItemProps) => {
  if (!mod) {
    return false;
  }
  const {
    source: { url },
    descriptor: {
      name: { value: name = '' } = {},
      target: { options = {} } = {},
    },
  } = mod;
  const externalTargetUrl = url;
  if (component) {
    return React.createElement(
      component,
      {
        module: mod,
        externalTargetUrl,
        // eslint-disable-next-line no-return-assign
        onClick: () =>
          externalTargetUrl && (window.location.href = externalTargetUrl),
      },
      name
    );
  }
  return (
    <a href={externalTargetUrl} title={options.tooltip}>
      {name}
    </a>
  );
};
