import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import Lozenge, { ThemeAppearance } from '@atlaskit/lozenge';
import { useIntl } from 'src/hooks/intl';
import messages from './pull-request-activity-events.i18n';
import * as styles from './pull-request-event.styled';

const statusAppearance: ThemeAppearance = {
  OPEN: 'inprogress',
  MERGED: 'success',
  DECLINED: 'removed',
};

const statusMessage = {
  OPEN: messages.openedEventLozenge,
  MERGED: messages.mergedEventLozenge,
  DECLINED: messages.declinedEventLozenge,
};

type Props = {
  status: string;
};

export const PullRequestStatusEntry = ({ status }: Props) => {
  const intl = useIntl();
  // @ts-ignore TODO: fix noImplicitAny error here
  const lozengeText = intl.formatMessage(statusMessage[status]);

  return (
    <Fragment>
      <Lozenge isBold appearance={statusAppearance[status]}>
        {lozengeText}
      </Lozenge>
      <styles.MessageText>
        <FormattedMessage {...messages.pullRequestContextMessage} />
      </styles.MessageText>
    </Fragment>
  );
};
