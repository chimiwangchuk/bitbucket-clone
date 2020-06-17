import React from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Button from '@atlaskit/button';

import messages from './i18n';

export const DashboardLink = React.memo(() => (
  <Link to="/dashboard/overview">
    <FormattedMessage {...messages.dashboardLinkText} />
  </Link>
));

export const PreviousPageLink = withRouter(
  React.memo((props: RouteComponentProps) => (
    <Button spacing="none" appearance="link" onClick={props.history.goBack}>
      <FormattedMessage {...messages.previousPageLinkText} />
    </Button>
  ))
);
