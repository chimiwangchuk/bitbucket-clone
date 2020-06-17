import Button from '@atlaskit/button';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import TimeIcon from '@atlaskit/icon/glyph/recent';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Tooltip from '@atlaskit/tooltip';
import { colors } from '@atlaskit/theme';
import React, { Component } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';

import messages from '../../i18n';
import { BuildStatusesMap } from '../../types';

export type TriggerProps = {
  buildCounts: BuildStatusesMap;
  intl: InjectedIntl;
  onTrigger: () => void;
  isLoading?: boolean;
  iconSize?: 'small' | 'medium' | 'large' | 'xlarge';
};

class Trigger extends Component<TriggerProps> {
  render() {
    const { buildCounts, iconSize, onTrigger, isLoading, intl } = this.props;

    const { FAILED, INPROGRESS, STOPPED, SUCCESSFUL } = buildCounts;
    const total = FAILED + INPROGRESS + STOPPED + SUCCESSFUL;

    let IconComponent = CheckCircleIcon;
    let label = intl.formatMessage(messages.tooltipPassedStatus, {
      count: SUCCESSFUL,
      total,
    });
    let primaryColor = colors.G400;

    if (FAILED) {
      label = intl.formatMessage(messages.tooltipFailedStatus, {
        count: FAILED,
        total,
      });
      IconComponent = ErrorIcon;
      primaryColor = colors.R400;
    } else if (STOPPED) {
      IconComponent = WarningIcon;
      primaryColor = colors.Y400;
    } else if (INPROGRESS) {
      IconComponent = TimeIcon;
      primaryColor = colors.B300;
    }

    const BuildIcon = (
      <IconComponent
        size={iconSize}
        label={label}
        primaryColor={primaryColor}
      />
    );

    return (
      <Tooltip content={label} position="top">
        <Button
          onClick={onTrigger}
          isLoading={isLoading}
          appearance="subtle-link"
          iconBefore={BuildIcon}
        />
      </Tooltip>
    );
  }
}

export default injectIntl(Trigger);
