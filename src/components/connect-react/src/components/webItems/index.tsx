import React, { ReactNode, Fragment } from 'react';
import AkSpinner from '@atlaskit/spinner';
import Connect, { ConnectProps } from '../../main/connect';
import {
  ConnectModules,
  ConnectModulesRequestProps,
  ConnectModulesStandardProps,
} from '../../internal/modules';
import WebItem from './webItem';

export interface ConnectWebItemBaseProps {
  children?: (items: Array<React.ReactElement<any>>) => ReactNode;
  component?: React.ComponentType<any>;
  loadingComponent?: React.ComponentType<any>;
  loadingFailedComponent?: React.ComponentType<any>;
}

export type ConnectWebItemProps = ConnectWebItemBaseProps &
  ConnectModulesRequestProps &
  ConnectModulesStandardProps &
  ConnectProps;

const WebItemLoader = () => <AkSpinner size="small" />;
const WebItemLoaderFailed = () => null;

export default Connect(
  ({
    children,
    loadingComponent: Loading = WebItemLoader,
    loadingFailedComponent: LoadingFailed = WebItemLoaderFailed,
    ...props
  }: ConnectWebItemProps) => (
    <ConnectModules {...props} moduleType="webItems">
      {({ modules, loading, error }) => {
        if (error) {
          return (
            <LoadingFailed
              {...props}
              loadingFailedComponent={WebItemLoaderFailed}
            />
          );
        }
        if (loading) {
          return <Loading {...props} loadingComponent={WebItemLoader} />;
        }

        const items = modules.map(m => (
          <WebItem {...props} module={m} key={m.id} />
        ));
        return typeof children === 'function' ? (
          children(items)
        ) : items.length ? (
          <Fragment>{items}</Fragment>
        ) : (
          false
        );
      }}
    </ConnectModules>
  )
);
