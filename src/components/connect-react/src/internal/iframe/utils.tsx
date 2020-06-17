import { ComponentType, ReactNode } from 'react';
import { ConnectIframe } from '@atlassian/connect-module-core';
import { ConnectIframeDefinitions } from '@atlassian/connect-module-core/dist/es5/modules/app/ConnectIframe';

export type IframeContainerProps = {
  children: ReactNode;
  width: string | number | undefined;
  height: string | number | undefined;
};
export type IframeContainer = ComponentType<IframeContainerProps>;

export const iframeEmptyContainer = (ConnectIframe.defaultProps as ConnectIframeDefinitions.Props)
  .iframeContainer;

export function applyUrlFragment(
  url: string,
  moduleType: string,
  passLocation?: boolean
) {
  if (!passLocation || moduleType !== 'repoPages' || !window.location.hash) {
    return url;
  }
  return `${url}${window.location.hash}`;
}
