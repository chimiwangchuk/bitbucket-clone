import React from 'react';
import {
  withRouter as withReactRouter,
  RouteComponentProps,
} from 'react-router-dom';
import { withRouter as withAtlaskitRouter } from '@atlaskit/router';
import { getSsrFeatures } from 'src/utils/ssr-features';

export default <P extends RouteComponentProps>(
  Component: React.ComponentType<P>
) => {
  const WithReactRouter = withReactRouter(Component);
  const WithAtlaskitRouter = withAtlaskitRouter(Component);

  return (props: P) => {
    const { shouldCurrentRouteUseAtlaskitRouter } = getSsrFeatures();

    const Wrapped = shouldCurrentRouteUseAtlaskitRouter
      ? WithAtlaskitRouter
      : WithReactRouter;

    return <Wrapped {...props} />;
  };
};
