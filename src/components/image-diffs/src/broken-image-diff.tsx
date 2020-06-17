import React from 'react';
import { FormattedMessage } from 'react-intl';

import common from 'src/i18n/common';
import { CenteredGenericMessage } from './broken-image-diff.style';

import messages from './image-diff.i18n';

export const BrokenImageDiff = () => (
  <CenteredGenericMessage
    iconType="error"
    title={<FormattedMessage {...common.errorHeading} />}
  >
    <FormattedMessage
      tagName="p"
      {...messages.error}
      values={{
        contactLink: (
          <a href="https://support.atlassian.com/">support.atlassian.com</a>
        ),
      }}
    />
  </CenteredGenericMessage>
);
