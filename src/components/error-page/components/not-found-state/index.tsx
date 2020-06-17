import React from 'react';
import { FormattedMessage } from 'react-intl';

import CustomizedErrorState from '../customized-error-state';
import { DashboardLink, PreviousPageLink } from '../common';
import messages from './i18n';

export const NotFoundState = React.memo(() => (
  <CustomizedErrorState title={<FormattedMessage {...messages.title} />}>
    <p>
      <FormattedMessage
        {...messages.content}
        values={{
          previousPageLink: <PreviousPageLink />,
          dashboardPageLink: <DashboardLink />,
        }}
      />
    </p>
  </CustomizedErrorState>
));
