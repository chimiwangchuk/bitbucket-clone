/**
 * Higher order component that fires an Apdex page load event when wrapped-component has mounted.
 */

import React, { Component, ComponentType, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  stopApdex,
  startApdex,
  stopApdexWithAdditionalAttributes,
} from 'src/utils/analytics/apdex';
import waitForReactRender from 'src/utils/wait-for-react-render';
import { ApdexTask } from 'src/types/apdex';
import { BucketState } from 'src/types/state';

// @ts-ignore TODO: fix noImplicitAny error here
const getDisplayName = c => c.displayName || c.name || 'Component';

export const withApdex = (eventName: ApdexTask) => <P extends object>(
  Comp: ComponentType<P>
) =>
  class WithApdex extends Component<P> {
    static WrappedComponent = Comp;
    static displayName = `withApdex(${getDisplayName(Comp)})`;

    componentDidMount() {
      waitForReactRender(() => {
        stopApdex(eventName);
      });
    }

    render() {
      return <Comp {...this.props} />;
    }
  };

export const withApdexAndFeatureFlags = ({
  eventName,
  featureFlagNamesToSelectors,
  stopTimePerformanceMarkEntryName,
}: {
  eventName: ApdexTask;
  featureFlagNamesToSelectors: Array<{
    name: string;
    selector: (initialState: BucketState) => boolean;
  }>;
  stopTimePerformanceMarkEntryName?: string;
}) => <P extends object>(Comp: ComponentType<P>) => (props: P) => {
  const additionalAttributes = featureFlagNamesToSelectors.reduce(
    (acc, { name, selector }) => ({
      ...acc,
      ...{ [name]: useSelector(selector) },
    }),
    {}
  );

  useEffect(
    () =>
      stopApdexWithAdditionalAttributes(
        eventName,
        {
          featureFlags: additionalAttributes,
        },
        stopTimePerformanceMarkEntryName
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return <Comp {...props} />;
};

/**
 * Higher order component that fires an Apdex transition event when the user uses
 * browsers navigation button (back/forward).
 *
 * Only route components should be wrapped into this HOC.
 */

export const withApdexTransition = (eventName: ApdexTask) => <
  P extends RouteComponentProps
>(
  Comp: ComponentType<P>
) => {
  return class WithApdexTransition extends Component<P> {
    unlistenHistoryChanges: () => void;

    static WrappedComponent = Comp;
    static displayName = `WithApdexTransition(${getDisplayName(Comp)})`;

    componentDidMount() {
      this.unlistenHistoryChanges = this.props.history.listen((_, action) => {
        if (action === 'POP') {
          startApdex({
            task: eventName,
            type: 'transition',
          });
        }
      });
    }

    componentWillUnmount() {
      this.unlistenHistoryChanges();
    }

    render() {
      return <Comp {...this.props} />;
    }
  };
};
