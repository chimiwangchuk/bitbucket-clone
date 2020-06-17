// Module includes:
// - Convenience utility for Loadable
import React from 'react';
import Loadable from 'react-loadable';
import LoadingPage from '../sections/global/components/loading-page';

export const defaultLoadable = (
  componentToLoad: Loadable.Options<any, any>['loader']
) =>
  Loadable({
    loading: () => <LoadingPage />,
    loader: componentToLoad,
  });

export const hiddenLoadable = (
  componentToLoad: Loadable.Options<any, any>['loader']
) =>
  Loadable({
    loading: () => null,
    loader: componentToLoad,
  });
