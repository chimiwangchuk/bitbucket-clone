import React from 'react';

import { BuildStatusConnected } from 'src/components/build-status';
import { DetailedRepository } from 'src/sections/dashboard/types';
import messages from './repository-build-status.i18n';

type Props = {
  repository: DetailedRepository;
};

class RepositoryBuildStatus extends React.Component<Props> {
  render() {
    const { repository } = this.props;

    if (repository.status_counts && repository.statusUrl) {
      return (
        <BuildStatusConnected
          buildCounts={repository.status_counts}
          statusUrl={repository.statusUrl}
          buildFailureTitle={messages.buildFailureTitle}
          buildFailureDescription={messages.buildFailureDescription}
        />
      );
    }

    return null;
  }
}

export default RepositoryBuildStatus;
