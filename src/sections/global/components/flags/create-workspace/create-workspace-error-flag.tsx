import React from 'react';
import Error from '@atlaskit/icon/glyph/error';
import { FormattedMessage } from 'react-intl';
import { AutoDismissFlag } from '@atlaskit/flag';
import { colors } from '@atlaskit/theme';
import { ComponentFlagId } from 'src/redux/flags/types';
import { useIntl } from 'src/hooks/intl';
import settings from 'src/settings';
import messages from './create-workspace-error-flag.i18n';

type Props = {
  id: ComponentFlagId;
  description: string;
};

const CreateWorkspaceErrorFlag = ({
  id,
  description,
  ...otherProps
}: Props) => {
  const intl = useIntl();
  return (
    <AutoDismissFlag
      {...otherProps}
      id={id}
      title={intl.formatMessage(messages.workspaceCreateErrorTitle)}
      icon={<Error label="Error" primaryColor={colors.R300} />}
      description={
        <FormattedMessage
          {...messages.workspaceCreateErrorDescription}
          values={{
            checkStatus: (
              <a href={settings.STATUSPAGE_URL}>
                <FormattedMessage
                  {...messages.workspaceCreateCheckStatusPage}
                />
              </a>
            ),
          }}
        />
      }
    />
  );
};

export default CreateWorkspaceErrorFlag;
