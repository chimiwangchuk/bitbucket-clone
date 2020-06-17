import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { getCurrentPullRequest } from 'src/redux/pull-request/selectors';
import { getTargetUserKey } from 'src/selectors/user-selectors';
import { BucketState } from 'src/types/state';
import { PullRequestViewWebPanels } from '../components/pr-web-panels';

const mapStateToProps = (state: BucketState) => ({
  principalId: getTargetUserKey(state),
  target: getCurrentPullRequest(state),
});

class ConnectPullRequestViewWebPanels extends PureComponent<any> {
  render() {
    const { principalId, target } = this.props;
    if (!principalId || !target) {
      return null;
    }
    return (
      <PullRequestViewWebPanels principalId={principalId} target={target} />
    );
  }
}

export default connect(mapStateToProps)(ConnectPullRequestViewWebPanels);
