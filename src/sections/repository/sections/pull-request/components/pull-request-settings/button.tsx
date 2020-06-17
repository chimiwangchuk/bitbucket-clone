import Button from '@atlaskit/button';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import Tooltip from '@atlaskit/tooltip';
import React from 'react';
import { useDispatch } from 'react-redux';

import { useIntl } from 'src/hooks/intl';
import { toggleSettingsDialog } from 'src/redux/pull-request-settings';

import messages from './i18n';

export const PullRequestSettingsButton = React.memo(() => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const handleClick = () => dispatch(toggleSettingsDialog(true));

  return (
    <Tooltip content={intl.formatMessage(messages.modalHeading)}>
      <Button
        appearance="subtle"
        onClick={handleClick}
        iconBefore={
          <SettingsIcon label={intl.formatMessage(messages.iconLabel)} />
        }
      />
    </Tooltip>
  );
});
