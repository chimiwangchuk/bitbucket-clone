/**
 * Higher order component to fire a `statsd` event when wrapped-component has mounted.
 */

import React, { Component, ComponentType, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BucketState } from 'src/types/state';
import { sendPageLoadMetric } from './send-page-load-metric';
import { sendPageLoadMetricWithFeatureFlags } from './send-page-load-metric-with-custom-tags';

// @ts-ignore TODO: fix noImplicitAny error here
const getDisplayName = c => c.displayName || c.name || 'Component';

export const withStatsd = (
  metricName: string,
  customStartEvent?: keyof PerformanceTiming
) => <P extends object>(Comp: ComponentType<P>) =>
  class WithStatsd extends Component<P> {
    static WrappedComponent = Comp;
    static displayName = `withStatsd(${getDisplayName(Comp)})`;

    componentDidMount() {
      sendPageLoadMetric(metricName, customStartEvent);
    }

    render() {
      return <Comp {...this.props} />;
    }
  };

export const withStatsdAndFeatureFlags = ({
  metricName,
  customStartEvent,
  featureFlagNamesToSelectors,
  customEndEvent,
}: {
  metricName: string;
  customStartEvent?: keyof PerformanceTiming;
  featureFlagNamesToSelectors: Array<{
    name: string;
    selector: (initialState: BucketState) => boolean;
  }>;
  customEndEvent?: string;
}) => <P extends object>(Comp: ComponentType<P>) => (props: P) => {
  const featureFlags = featureFlagNamesToSelectors.map(
    ({ name, selector }) => ({
      name,
      isEnabled: useSelector(selector),
    })
  );

  useEffect(() => {
    sendPageLoadMetricWithFeatureFlags({
      metricName,
      customStartEvent,
      featureFlags,
      customEndEvent,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Comp {...props} />;
};
