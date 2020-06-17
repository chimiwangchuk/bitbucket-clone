import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import {
  FeatureProvider as BaseProvider,
  EnvironmentType,
} from '@atlassian/bitbucket-features';

import { analyticsClient } from 'src/utils/analytics/client';
import { getCurrentFeatureFlagUser } from 'src/selectors/user-selectors';
import { getBbEnv } from 'src/utils/bb-env';
import { BbEnv } from '@atlassian/bitbucket-navigation/src/types';
import { FeatureKeys } from 'src/config/feature-flag-keys';
import { getIsFx3Enabled } from 'src/selectors/feature-selectors';
import { getInitialOrBucketState } from 'src/utils/ssr';
import { BucketState } from '../types/state';

const envMap: { [bbEnv in BbEnv]: EnvironmentType } = {
  [BbEnv.Development]: EnvironmentType.DEV,
  [BbEnv.Staging]: EnvironmentType.STAGING,
  [BbEnv.Production]: EnvironmentType.PROD,
};

export const FeatureProvider: React.FC<{}> = ({ children }) => {
  // For now we need to avoid unmounting the child components due to a
  // bug with the AK router. This can be replaced with `useSelector`
  // once the router has been updated
  const isFx3Enabled = getIsFx3Enabled(
    (getInitialOrBucketState() as BucketState) || {}
  );
  const user = useSelector(getCurrentFeatureFlagUser);
  const env = envMap[getBbEnv() || BbEnv.Development];
  const apiKey = FeatureKeys[env];

  if (!isFx3Enabled) {
    return <Fragment>{children}</Fragment>;
  }

  return (
    <BaseProvider
      analyticsWebClient={analyticsClient()}
      apiKey={apiKey}
      featureFlagUser={user}
      options={{
        productKey: 'bitbucket',
        environment: env,
      }}
    >
      {children}
    </BaseProvider>
  );
};
