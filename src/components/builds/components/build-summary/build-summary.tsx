import React, { Component } from 'react';

import Build from './build';

type BuildsSummaryProps = {
  builds: BB.BuildStatus[];
  padding?: number;
  shouldSort?: boolean;
};

export default class BuildSummary extends Component<BuildsSummaryProps> {
  static defaultProps = {
    builds: [],
    shouldSort: true,
  };

  render() {
    const { builds, shouldSort } = this.props;

    if (shouldSort) {
      const stateOrder: Array<BB.BuildStatus['state']> = [
        'FAILED',
        'STOPPED',
        'INPROGRESS',
        'SUCCESSFUL',
      ];
      builds.sort((a, b) => {
        const aState = stateOrder.indexOf(a.state);
        const bState = stateOrder.indexOf(b.state);
        if (aState !== bState) {
          return aState - bState;
        }

        // `numeric` option sorts numbers nicely, e.g. "1", "2", "10" (instead of string sort "1", "10", "2")
        const nameCmp = a.name.localeCompare(b.name, undefined, {
          numeric: true,
        });
        if (nameCmp !== 0) {
          return nameCmp;
        }

        // Fall back to key if name and state are the same
        return a.key.localeCompare(b.key, undefined, { numeric: true });
      });
    }
    return builds.map(build => <Build key={build.key} build={build} />);
  }
}
