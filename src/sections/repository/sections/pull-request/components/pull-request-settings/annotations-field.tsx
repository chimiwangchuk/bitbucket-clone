import { ToggleStateless } from '@atlaskit/toggle';
import { StatelessProps as ToggleStatelessProps } from '@atlaskit/toggle/dist/esm/types';
import React, { useCallback } from 'react';

import { useIntl } from 'src/hooks/intl';

import messages from './i18n';
import { usePullRequestSettingsForm } from './pull-request-settings-form';
import { Field } from './styled';

export const AnnotationsField = React.memo((props: ToggleStatelessProps) => {
  const intl = useIntl();

  const [formState, setFormState] = usePullRequestSettingsForm();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isAnnotationsEnabled = !!event.currentTarget.checked;
      setFormState(state => ({ ...state, isAnnotationsEnabled }));
    },
    [setFormState]
  );

  return (
    <Field>
      {/* @atlaskit/toggle handles its <label> internally but doesn't support rendering it in the UI */}
      <div>{intl.formatMessage(messages.annotationsLabel)}</div>
      <ToggleStateless
        {...props}
        isChecked={formState.isAnnotationsEnabled}
        label={intl.formatMessage(messages.annotationsLabel)}
        name="enableAnnotations"
        onChange={handleChange}
        value="enableAnnotations"
      />
    </Field>
  );
});
