import React from 'react';
import { FormattedMessage } from 'react-intl';
import GenericMessage from 'src/components/generic-message';
import common from 'src/i18n/common';
import messages from './diff.i18n';

export const BrokenDiffMessage = () => (
  <GenericMessage
    iconType="error"
    title={<FormattedMessage {...common.errorHeading} />}
  >
    <FormattedMessage
      tagName="p"
      {...messages.diffError}
      values={{
        contactLink: (
          <a href="https://support.atlassian.com/">support.atlassian.com</a>
        ),
      }}
    />
  </GenericMessage>
);
