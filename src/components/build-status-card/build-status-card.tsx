import React, { PureComponent } from 'react';
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl';
import Button from '@atlaskit/button';
import RefreshIcon from '@atlaskit/icon/glyph/refresh';
import Tooltip from '@atlaskit/tooltip';
import { BuildSummary } from '@atlassian/bitkit-builds';
import { Expander, ExpanderOnChangeEvent } from 'src/components/sidebar';

import GenericMessage from 'src/components/generic-message';

import { getBuildStatuses } from './utils';
import messages from './build-status-card.i18n';
import BuildStatusPipelinesPromotion from './build-status-pipelines-promotion';

type BuildStatusProps = {
  builds: BB.BuildStatus[];
  hasStatuses: boolean;
  intl: InjectedIntl;
  isCollapsed: boolean;
  initialCardIsCollapsed: boolean;
  onChange: (event: ExpanderOnChangeEvent) => void;
  isLoading: boolean;
  repositoryFullSlug?: string;
  hasError: boolean;
  onErrorClick: () => Promise<any>;
};

class BuildStatusCard extends PureComponent<BuildStatusProps> {
  static defaultProps = {
    builds: [],
    isCollapsed: false,
  };

  renderLabels = () => {
    const { builds, intl } = this.props;
    const { FAILED, SUCCESSFUL } = getBuildStatuses(builds);

    if (builds.length === 0) {
      const countNoBuilds = 0;

      return {
        rich: (
          <FormattedMessage
            {...messages.zeroBuilds}
            values={{
              formattedCount: <strong>{countNoBuilds}</strong>,
            }}
          />
        ),
        plain: intl.formatMessage(messages.zeroBuilds, {
          formattedCount: countNoBuilds,
        }),
      };
    }

    if (FAILED) {
      const countFailed = `${FAILED} of ${builds.length}`;

      return {
        rich: (
          <FormattedMessage
            {...messages.failedStatus}
            values={{
              total: builds.length,
              formattedCount: <strong>{countFailed}</strong>,
            }}
          />
        ),
        plain: intl.formatMessage(messages.failedStatus, {
          total: builds.length,
          formattedCount: countFailed,
        }),
      };
    }

    const countSuccess = `${SUCCESSFUL} of ${builds.length}`;

    return {
      rich: (
        <FormattedMessage
          {...messages.passedStatus}
          values={{
            total: builds.length,
            formattedCount: <strong>{countSuccess}</strong>,
          }}
        />
      ),
      plain: intl.formatMessage(messages.passedStatus, {
        total: builds.length,
        formattedCount: countSuccess,
      }),
    };
  };

  renderExpanderContent = () => {
    const {
      builds,
      hasError,
      onErrorClick,
      repositoryFullSlug,
      hasStatuses,
    } = this.props;

    if (hasError) {
      return (
        <GenericMessage
          iconType="warning"
          title={<FormattedMessage {...messages.errorHeading} />}
        >
          <Button appearance="link" onClick={onErrorClick}>
            <FormattedMessage {...messages.errorAction} />
          </Button>
        </GenericMessage>
      );
    }

    if (builds.length) {
      return <BuildSummary builds={builds} />;
    }

    if (!!repositoryFullSlug && !hasStatuses) {
      return (
        <BuildStatusPipelinesPromotion
          repositoryFullSlug={repositoryFullSlug}
        />
      );
    }

    return null;
  };

  render() {
    const {
      isCollapsed,
      isLoading,
      initialCardIsCollapsed,
      onChange,
      intl,
      builds,
    } = this.props;
    const { plain: plainLabel, rich: richLabel } = this.renderLabels();
    const icon = <RefreshIcon label="Builds" />;
    const hasPassed = builds.every(b => b.state === 'SUCCESSFUL');

    if (isCollapsed) {
      return (
        <Tooltip position="left" content={plainLabel}>
          <Button appearance="subtle" iconBefore={icon} />
        </Tooltip>
      );
    }

    return (
      <Expander
        icon={icon}
        defaultIsCollapsed={initialCardIsCollapsed || hasPassed}
        isLoading={isLoading}
        onChange={onChange}
        label={richLabel}
        ariaLabel={intl.formatMessage(messages.label)}
      >
        {this.renderExpanderContent()}
      </Expander>
    );
  }
}

export default injectIntl(BuildStatusCard);
