import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  DashboardLink,
  PreviousPageLink,
} from 'src/components/error-page/components/common';
import CustomizedErrorState from '../customized-error-state';
import { buildSocialAuthLink } from '../utils';
import messages from './i18n';

type Props = {
  userEmail?: string;
};

export const ForbiddenState = ({ userEmail }: Props) => (
  <CustomizedErrorState title={<FormattedMessage {...messages.title} />}>
    <p>
      <FormattedMessage
        {...messages.content}
        values={{
          loginPageLink: (
            <a href={userEmail && buildSocialAuthLink(userEmail)}>
              <FormattedMessage {...messages.loginLinkText} />
            </a>
          ),
          previousPageLink: <PreviousPageLink />,
          dashboardPageLink: <DashboardLink />,
        }}
      />
    </p>
  </CustomizedErrorState>
);
