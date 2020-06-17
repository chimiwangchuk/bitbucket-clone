import React, { Component } from 'react';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import TimeIcon from '@atlaskit/icon/glyph/recent';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { colors } from '@atlaskit/theme';

import { injectIntl, InjectedIntl } from 'react-intl';
import { RelativeDate } from '@atlassian/bitkit-date';
import { BuildStatus } from 'src/components/types';

import messages from '../../i18n';
import * as styles from '../../styles';

type BuildProps = {
  build: BuildStatus;
  intl: InjectedIntl;
};

const BUILD_STATUS_ICON_LABELS = new Map([
  ['SUCCESSFUL', messages.successfulStatusIcon],
  ['STOPPED', messages.stoppedStatusIcon],
  ['FAILED', messages.failedStatusIcon],
  ['INPROGRESS', messages.inProgressStatusIcon],
]);

export default injectIntl(
  class Build extends Component<BuildProps> {
    getStatusIcon = (buildState: string) => {
      const message = BUILD_STATUS_ICON_LABELS.get(buildState);
      let label = '';

      if (message) {
        label = this.props.intl.formatMessage(message);
      }

      switch (buildState) {
        case 'SUCCESSFUL':
          return <CheckCircleIcon label={label} primaryColor={colors.G300} />;
        case 'STOPPED':
          return <WarningIcon label={label} primaryColor={colors.Y400} />;
        case 'FAILED':
          return <ErrorIcon label={label} primaryColor={colors.R400} />;
        case 'INPROGRESS':
          return <TimeIcon label={label} primaryColor={colors.B300} />;
        default:
          return null;
      }
    };

    render() {
      const { build } = this.props;
      const buildName = build.name || build.key;
      return (
        <styles.BuildItem>
          <styles.BuildState>
            {this.getStatusIcon(build.state)}
          </styles.BuildState>
          <styles.BuildInfo>
            <styles.BuildName title={buildName}>
              {build.url ? (
                <a href={build.url} target="_blank">
                  {buildName}
                </a>
              ) : (
                buildName
              )}
            </styles.BuildName>
            <styles.BuildDetails>
              <styles.BuildDescription title={build.description}>
                {build.description}
              </styles.BuildDescription>
              <styles.BuildTime>
                <RelativeDate date={build.updated_on} />
              </styles.BuildTime>
            </styles.BuildDetails>
          </styles.BuildInfo>
        </styles.BuildItem>
      );
    }
  }
);
