import { PureComponent } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';

import { getName } from './utils';

type Props = {
  intl: InjectedIntl;
  /** A Bitbucket user or team. */
  user: BB.User | BB.Team | null | undefined;
};

class UserName extends PureComponent<Props> {
  render() {
    return getName(this.props.user, this.props.intl);
  }
}

export default injectIntl(UserName);
