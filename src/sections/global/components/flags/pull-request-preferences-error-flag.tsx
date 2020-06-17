import Flag from '@atlaskit/flag';
import Warning from '@atlaskit/icon/glyph/warning';
import { colors } from '@atlaskit/theme';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { useIntl } from 'src/hooks/intl';
import { ComponentFlagProps } from 'src/redux/flags/types';
import { toggleSettingsDialog } from 'src/redux/pull-request-settings';
import messages from 'src/sections/repository/sections/pull-request/components/pull-request-settings/i18n';

import { AppearanceTypes } from './simple/simple-flag';

export const PullRequestPreferencesErrorFlag = React.memo(
  (props: ComponentFlagProps) => {
    const intl = useIntl();
    const dispatch = useDispatch();

    const actions = useMemo(
      () => [
        {
          content: intl.formatMessage(messages.errorFlagRetryButton),
          onClick: () => {
            dispatch(toggleSettingsDialog(true));
            if (props.onDismissed) {
              props.onDismissed(props.id);
            }
          },
        },
      ],
      [dispatch, intl]
    );

    return (
      <Flag
        actions={actions}
        appearance={AppearanceTypes.normal}
        description={intl.formatMessage(messages.errorFlagDescription)}
        icon={<Warning label="" primaryColor={colors.Y300} />}
        title={intl.formatMessage(messages.errorFlagTitle)}
        {...props}
      />
    );
  }
);
