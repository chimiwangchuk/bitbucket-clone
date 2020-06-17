import { ToggleStateless } from '@atlaskit/toggle';
import { StatelessProps as ToggleStatelessProps } from '@atlaskit/toggle/dist/esm/types';
import React, { useCallback } from 'react';

import { useIntl } from 'src/hooks/intl';

import messages from './i18n';
import { usePullRequestSettingsForm } from './pull-request-settings-form';
import { Field } from './styled';

export const WordDiffField = React.memo((props: ToggleStatelessProps) => {
  const intl = useIntl();

  const [formState, setFormState] = usePullRequestSettingsForm();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isWordDiffEnabled = !!event.currentTarget.checked;
      setFormState(state => ({ ...state, isWordDiffEnabled }));
    },
    [setFormState]
  );

  return (
    <Field>
      {/* @atlaskit/toggle handles its <label> internally but doesn't support rendering it in the UI */}
      <div>{intl.formatMessage(messages.wordDiffLabel)}</div>
      <ToggleStateless
        {...props}
        isChecked={formState.isWordDiffEnabled}
        label={intl.formatMessage(messages.wordDiffLabel)}
        name="enableWordDiff"
        onChange={handleChange}
        value="enableWordDiff"
      />
    </Field>
  );
});
