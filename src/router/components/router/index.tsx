import React, { ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Router as AtlaskitRouter,
  Routes,
  StaticRouter,
} from '@atlaskit/router';
import { BrowserHistory } from '@atlaskit/router/dist/cjs/common/types';
import { RouterProps as AtlaskitRouterProps } from '@atlaskit/router/dist/cjs/controllers/router/types';
import { getResourceStoreSsrState } from 'src/utils/ssr-hydration';
import { HYDRATE_FROM_LOCALSTORAGE } from '../../../redux/global/actions';

type RouterProps = AtlaskitRouterProps & {
  history: BrowserHistory;
  routes: Routes;
  children: ReactNode;
  isSsr: boolean;
  location: string;
};

const Router = ({
  history,
  routes,
  children,
  isSsr,
  location,
  ...rest
}: RouterProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // useEffect as we only want to hydrate from localstorage on the client
    dispatch({ type: HYDRATE_FROM_LOCALSTORAGE });
  }, [dispatch]);

  if (isSsr) {
    return (
      <StaticRouter routes={routes} location={location}>
        {children}
      </StaticRouter>
    );
  }

  return (
    <AtlaskitRouter
      history={history}
      routes={routes}
      resourceData={getResourceStoreSsrState()}
      {...rest}
    >
      {children}
    </AtlaskitRouter>
  );
};

Router.defaultProps = {
  isStatic: false,
  // eslint-disable-next-line
  transitionBlocker: async () => true,
};

export default Router;
