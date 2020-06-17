import React, { PureComponent, ReactNode } from 'react';
import Path from './path';
import * as styles from './path.style';

export type ExpandablePathProps = {
  children: ReactNode;
  maxCollapsedPathSegments: number;
  separator: string;
};

type State = {
  isExpanded: boolean;
};

export default class ExpandablePath extends PureComponent<
  ExpandablePathProps,
  State
> {
  static defaultProps = {
    maxCollapsedPathSegments: 4,
    separator: '/',
  };

  state = {
    isExpanded: false,
  };

  expand = () => {
    this.setState({ isExpanded: true });
  };

  truncatePaths(paths: React.ReactNode[]) {
    const { maxCollapsedPathSegments } = this.props;

    // If we'd only be hiding 1 path behind the expander, just render it
    if (this.state.isExpanded || paths.length <= maxCollapsedPathSegments + 1) {
      return paths;
    }

    return [
      ...paths.slice(0, maxCollapsedPathSegments / 2),
      this.renderExpander(),
      ...paths.slice(-maxCollapsedPathSegments / 2),
    ];
  }

  renderExpander() {
    return (
      <styles.Expander key="expander" onClick={this.expand}>
        ...
      </styles.Expander>
    );
  }

  render() {
    const { children, separator } = this.props;
    const childrenArray = React.Children.toArray(children);
    return (
      <Path separator={separator}>{this.truncatePaths(childrenArray)}</Path>
    );
  }
}
