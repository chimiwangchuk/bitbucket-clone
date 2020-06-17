import { connect } from 'react-redux';
import React from 'react';
import { BucketState } from 'src/types/state';

const mapStateToProps = (state: BucketState) => ({
  features: state.global.features,
});

type Props = {
  children: React.ReactNode;
  feature: string;
  fallback?: React.ReactNode;
};

type InjectedProps = {
  features: object;
};

/**
 * Example usage:
 * <FeatureToggle feature="my-feature" fallback={<FallbackComponent />}>
 *    <MyFeatureComponent />
 * </FeatureToggle>
 */
export const FeatureToggle = connect(mapStateToProps)(((
  props: Props & InjectedProps
) => {
  const { children, fallback, feature, features } = props;

  // This is to prevent the `children` or `fallback` from rendering if
  // feature flags are not available.
  if (!features) {
    return null;
  }

  // @ts-ignore TODO: fix noImplicitAny error here
  const isFeatureEnabled = !!features[feature];
  if (isFeatureEnabled) {
    return children;
  } else if (fallback) {
    return fallback;
  } else {
    return null;
  }
}) as React.FunctionComponent<Props>);
FeatureToggle.displayName = 'FeatureToggle';
