import React from 'react';
import Connect, { ConnectProps } from '../../main/connect';
import {
  ConnectIframes,
  ConnectIframeChildArgs,
} from '../../internal/iframe/connectIframes';
import {
  ConnectModulesRequestProps,
  ConnectModulesStandardProps,
} from '../../internal/modules';

export interface ConnectWebPanelsBaseProps {
  children?: (items: Array<React.ReactElement<any>>) => JSX.Element;
  width?: string;
  height?: string;
  options?: any;
}

export type ConnectWebPanelsProps = ConnectWebPanelsBaseProps &
  ConnectModulesRequestProps &
  ConnectModulesStandardProps &
  ConnectProps;

export default Connect(
  ({
    children,
    width = '100%',
    height,
    options = {},
    ...props
  }: ConnectWebPanelsProps) => (
    <ConnectIframes {...props} moduleType="webPanels">
      {(iframes: ConnectIframeChildArgs[]) => {
        const iframeChildren = iframes.map(
          ({ Component: Iframe, module: m }) => (
            <Iframe
              width={width}
              height={height}
              options={options}
              key={m.id}
            />
          )
        );
        return typeof children === 'function'
          ? children(iframeChildren)
          : iframeChildren;
      }}
    </ConnectIframes>
  )
);
