import Lozenge from '@atlaskit/lozenge';
import React, { PureComponent } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';

import messages from './i18n';

type UserOrTeam = BB.User | BB.Team;

function isUser(
  userOrTeam: BB.User | BB.Team | null | undefined
): userOrTeam is BB.User {
  return !!userOrTeam && (userOrTeam as BB.User).type === 'user';
}

type Props = {
  intl: InjectedIntl;
  /** A Bitbucket user or team. */
  user: UserOrTeam | null | undefined;
};

class UserStatusLozenge extends PureComponent<Props> {
  getStatus() {
    const { intl, user } = this.props;

    if (!user) {
      return intl.formatMessage(messages.statusLabelDeleted);
    }
    if (isUser(user) && user.account_status === 'inactive') {
      return intl.formatMessage(messages.statusLabelDeactivated);
    }
    if (isUser(user) && user.account_status === 'closed') {
      return intl.formatMessage(messages.statusLabelDeleted);
    }

    return undefined;
  }

  render() {
    const status = this.getStatus();
    return status ? <Lozenge>{status}</Lozenge> : null;
  }
}

export default injectIntl(UserStatusLozenge);
