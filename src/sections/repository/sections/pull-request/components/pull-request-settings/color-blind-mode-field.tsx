import React, { useCallback } from 'react';
import { ToggleStateless } from '@atlaskit/toggle';
import { StatelessProps as ToggleStatelessProps } from '@atlaskit/toggle/dist/esm/types';

import { useIntl } from 'src/hooks/intl';

import messages from './i18n';
import { usePullRequestSettingsForm } from './pull-request-settings-form';
import { Field } from './styled';

export const ColorBlindModeField = React.memo((props: ToggleStatelessProps) => {
  const intl = useIntl();
  const [formState, setFormState] = usePullRequestSettingsForm();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isColorBlindModeEnabled = !!event.currentTarget.checked;
      setFormState(state => ({ ...state, isColorBlindModeEnabled }));
    },
    [setFormState]
  );

  return (
    <Field>
      {/* @atlaskit/toggle handles its <label> internally but doesn't support rendering it in the UI */}
      <div>{intl.formatMessage(messages.colorAccessibilityLabel)}</div>
      <ToggleStateless
        {...props}
        isChecked={formState.isColorBlindModeEnabled}
        label={intl.formatMessage(messages.colorAccessibilityLabel)}
        name="enableColorBlindMode"
        onChange={handleChange}
        value="enableColorBlindMode"
      />
    </Field>
  );
});
