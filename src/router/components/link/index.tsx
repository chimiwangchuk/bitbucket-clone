import React from 'react';
import { Link as ReactRouterLink, LinkProps } from 'react-router-dom';
import { Link as AtlaskitLink } from '@atlaskit/router';
import { getSsrFeatures } from 'src/utils/ssr-features';

const Link = (props: LinkProps) => {
  const { isAtlaskitRouterEnabled } = getSsrFeatures();
  return isAtlaskitRouterEnabled ? (
    // @ts-ignore Can be fixed when https://jdog.jira-dev.com/browse/SSRS-36 is resolved
    <AtlaskitLink {...props} />
  ) : (
    <ReactRouterLink {...props} />
  );
};
export default Link;
