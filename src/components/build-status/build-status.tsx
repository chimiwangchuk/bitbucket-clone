import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import {
  BuildStatus as BkBuildStatus,
  LazyBuildStatus as BkLazyBuildStatus,
} from '@atlassian/bitkit-builds';
import { IconSizes } from '@atlassian/bitkit-icon';
import { BuildStatus as BuildStatusType } from 'src/components/types';

import { showFlag } from 'src/redux/flags';
import { BuildStatusesMap } from 'src/types';
import authRequest from 'src/utils/fetch';

type BuildFailureMessages = {
  buildFailureTitle: FormattedMessage.MessageDescriptor;
  buildFailureDescription: FormattedMessage.MessageDescriptor;
};

type Props = {
  commitStatuses?: BuildStatusType[];
  buildCounts?: BuildStatusesMap;
  showError: (messages: BuildFailureMessages) => {};
  statusUrl: string;
  buildFailureTitle: FormattedMessage.MessageDescriptor;
  buildFailureDescription: FormattedMessage.MessageDescriptor;
  iconSize?: IconSizes;
};

class BuildStatusConnected extends React.Component<Props> {
  loadBuilds = async () => {
    const { buildFailureTitle, buildFailureDescription } = this.props;
    try {
      const response = await fetch(authRequest(this.props.statusUrl));
      if (!response.ok) {
        throw new Error();
      }
      const json = await response.json();
      return json.values;
    } catch (e) {
      this.props.showError({ buildFailureTitle, buildFailureDescription });
      return [];
    }
  };

  render() {
    const { commitStatuses, buildCounts, iconSize } = this.props;

    if (commitStatuses && commitStatuses.length) {
      return <BkBuildStatus iconSize={iconSize} builds={commitStatuses} />;
    }

    if (buildCounts) {
      return (
        <BkLazyBuildStatus
          buildCounts={buildCounts}
          loadBuilds={this.loadBuilds}
          iconSize={iconSize}
        />
      );
    }

    return null;
  }
}

const mapDispatchToProps = {
  showError: (messages: BuildFailureMessages) =>
    showFlag({
      type: 'error',
      id: 'build-status',
      title: { msg: messages.buildFailureTitle },
      description: { msg: messages.buildFailureDescription },
      autoDismiss: true,
    }),
};

export default connect(null, mapDispatchToProps)(BuildStatusConnected);
