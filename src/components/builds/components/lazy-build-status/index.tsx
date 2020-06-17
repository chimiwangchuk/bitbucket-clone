import React, { Fragment, Component } from 'react';

import { IconSizes } from '@atlassian/bitkit-icon';
import { BuildStatus } from 'src/components/types';
import { BuildStatusesMap } from '../../types';
import Trigger from '../build-status/trigger';
import { BuildSummary } from '../build-summary';
import { BuildStatusModalDialog } from '../modal-dialog';

type Props = {
  buildCounts: BuildStatusesMap;
  loadBuilds: () => Promise<BuildStatus[]>;
  iconSize?: IconSizes;
};

type State = {
  isDialogOpen: boolean;
  isLoadingBuilds: boolean;
  builds: BuildStatus[];
  lastCounts: BuildStatusesMap;
};

const totalBuilds = (buildCounts: BuildStatusesMap) => {
  const { FAILED, INPROGRESS, STOPPED, SUCCESSFUL } = buildCounts;
  return FAILED + INPROGRESS + STOPPED + SUCCESSFUL;
};

const isBuildCountsEqual = (a: BuildStatusesMap, b: BuildStatusesMap) =>
  // @ts-ignore TODO: fix noImplicitAny error here
  Object.keys(a).every(key => a[key] === b[key]);

class LazyBuildStatus extends Component<Props, State> {
  static getDerivedStateFromProps(props: Props, state: State) {
    // If we got new build counts, reset the list of full builds.
    if (!isBuildCountsEqual(props.buildCounts, state.lastCounts)) {
      return {
        ...state,
        builds: [],
        lastCounts: props.buildCounts,
      };
    }
    return null;
  }

  state = {
    isDialogOpen: false,
    isLoadingBuilds: false,
    builds: [],
    lastCounts: this.props.buildCounts,
  };

  onTrigger = () => {
    if (this.state.builds.length) {
      this.setState({ isDialogOpen: true });
      return;
    }

    this.setState({ isLoadingBuilds: true });
    this.props
      .loadBuilds()
      .then(builds => {
        // Check to see if we have a real array of builds.
        // Maybe the consumer caught an error and forgot to return
        // anything to us
        if (Array.isArray(builds) && builds.length) {
          this.setState({
            builds,
            isLoadingBuilds: false,
            isDialogOpen: true,
          });
        } else {
          this.setState({ isLoadingBuilds: false });
        }
      })
      .catch(() => {
        this.setState({ isLoadingBuilds: false });
      });
  };

  onCloseDialog = () => {
    this.setState({ isDialogOpen: false });
  };

  render() {
    const { isDialogOpen, isLoadingBuilds, builds } = this.state;
    const { buildCounts, iconSize } = this.props;
    const buildCount = totalBuilds(buildCounts);

    if (!buildCount) {
      return null;
    }

    return (
      <Fragment>
        <Trigger
          buildCounts={buildCounts}
          onTrigger={this.onTrigger}
          isLoading={isLoadingBuilds}
          iconSize={iconSize}
        />
        {isDialogOpen && (
          <BuildStatusModalDialog onClose={this.onCloseDialog}>
            <BuildSummary builds={builds} />
          </BuildStatusModalDialog>
        )}
      </Fragment>
    );
  }
}

export default LazyBuildStatus;
