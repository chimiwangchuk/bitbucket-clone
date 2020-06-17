import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { PullRequest } from 'src/components/types';
import { getTargetUserKey } from 'src/selectors/user-selectors';
import { getCurrentPullRequest } from 'src/redux/pull-request/selectors';
import { BucketState } from 'src/types/state';
import { WebCards } from '../components/web-cards';

const mapStateToProps = (state: BucketState) => ({
  principalId: getTargetUserKey(state),
  target: getCurrentPullRequest(state),
});

type ConnectPullRequestWebCardsProps = {
  principalId?: string;
  target?: PullRequest;
  isCollapsed?: boolean;
};

class ConnectPullRequestWebCards extends PureComponent<
  ConnectPullRequestWebCardsProps
> {
  render() {
    const { principalId, target, isCollapsed } = this.props;
    if (!principalId || !target) {
      return null;
    }
    return (
      <WebCards
        principalId={principalId}
        target={target}
        isCollapsed={isCollapsed}
        location="org.bitbucket.pullrequest"
      />
    );
  }
}

export default connect(mapStateToProps)(ConnectPullRequestWebCards);
