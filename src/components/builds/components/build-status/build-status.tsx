import React, { Fragment, Component } from 'react';
import { IconSizes } from '@atlassian/bitkit-icon';

import { BuildStatusesMap } from '../../types';

import { BuildSummary } from '../build-summary';
import { BuildStatusModalDialog } from '../modal-dialog';
import Trigger from './trigger';

type Props = {
  builds: BB.BuildStatus[];
  iconSize?: IconSizes;
};

type State = {
  isDialogOpen: boolean;
};

// @ts-ignore TODO: fix noImplicitAny error here
function getBuildCounts(builds): BuildStatusesMap {
  const statuses = {
    FAILED: 0,
    INPROGRESS: 0,
    STOPPED: 0,
    SUCCESSFUL: 0,
  };

  // @ts-ignore TODO: fix noImplicitAny error here
  return builds.reduce((acc, build) => {
    acc[build.state] += 1;

    return acc;
  }, statuses);
}

export default class BuildStatusComponent extends Component<Props, State> {
  state = {
    isDialogOpen: false,
  };

  onTrigger = () => {
    this.setState({ isDialogOpen: true });
  };

  onCloseDialog = () => {
    this.setState({ isDialogOpen: false });
  };

  render() {
    const { builds, iconSize } = this.props;
    const { isDialogOpen } = this.state;

    if (!builds) {
      return null;
    }

    return (
      <Fragment>
        <Trigger
          buildCounts={getBuildCounts(builds)}
          onTrigger={this.onTrigger}
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
