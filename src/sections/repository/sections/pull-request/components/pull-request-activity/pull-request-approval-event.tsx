import React, { PureComponent, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import Lozenge from '@atlaskit/lozenge';
import messages from './pull-request-activity-events.i18n';
import * as styles from './pull-request-event.styled';

class PullRequestApprovalEvent extends PureComponent<any> {
  render() {
    return (
      <Fragment>
        <Lozenge appearance="success">
          <FormattedMessage {...messages.appovedEventLozenge} />
        </Lozenge>
        <styles.MessageText>
          <FormattedMessage {...messages.pullRequestContextMessage} />
        </styles.MessageText>
      </Fragment>
    );
  }
}

export default PullRequestApprovalEvent;
