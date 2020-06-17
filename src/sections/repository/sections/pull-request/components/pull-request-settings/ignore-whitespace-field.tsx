import { ToggleStateless } from '@atlaskit/toggle';
import { StatelessProps as ToggleStatelessProps } from '@atlaskit/toggle/dist/esm/types';
import React, { useCallback } from 'react';

import { useIntl } from 'src/hooks/intl';

import messages from './i18n';
import { usePullRequestSettingsForm } from './pull-request-settings-form';
import { Field } from './styled';

export const IgnoreWhitespaceField = React.memo(
  (props: ToggleStatelessProps) => {
    const intl = useIntl();

    const [formState, setFormState] = usePullRequestSettingsForm();

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const shouldIgnoreWhitespace = !!event.currentTarget.checked;
        setFormState(state => ({ ...state, shouldIgnoreWhitespace }));
      },
      [setFormState]
    );

    return (
      <Field>
        {/* @atlaskit/toggle handles its <label> internally but doesn't support rendering it in the UI */}
        <div>{intl.formatMessage(messages.ignoreWhitespaceLabel)}</div>
        <ToggleStateless
          {...props}
          isChecked={formState.shouldIgnoreWhitespace}
          label={intl.formatMessage(messages.ignoreWhitespaceLabel)}
          name="shouldIgnoreWhitespace"
          onChange={handleChange}
          value="shouldIgnoreWhitespace"
        />
      </Field>
    );
  }
);
