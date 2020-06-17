/**
 * Higher order component to fire a Bitbucket Analytics Fact when wrapped-component has mounted.
 */

import React, { Component, ComponentType } from 'react';

import Fact from '@atlassian/bitkit-analytics';

import waitForReactRender from 'src/utils/wait-for-react-render';
import { publishPageLoadFact } from './publish-page-load-fact';

// @ts-ignore TODO: fix noImplicitAny error here
const getDisplayName = c => c.displayName || c.name || 'Component';

export const withFact = (
  factName: string,
  FactClass: Fact<any>,
  customStartEvent?: keyof PerformanceTiming
) => (Comp: ComponentType<any>) =>
  class WithFact extends Component<any> {
    static WrappedComponent = Comp;
    static displayName = `withFact(${getDisplayName(Comp)})`;

    componentDidMount() {
      const { factData } = this.props;

      waitForReactRender(() => {
        publishPageLoadFact(factName, FactClass, customStartEvent, factData);
      });
    }

    render() {
      const { factData, ...restProps } = this.props;

      return <Comp {...restProps} />;
    }
  };
