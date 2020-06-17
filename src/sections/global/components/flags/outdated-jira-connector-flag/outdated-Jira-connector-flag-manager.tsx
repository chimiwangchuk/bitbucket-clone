import React from 'react';
import { connect } from 'react-redux';

import { showFlagComponent, dismissFlag } from 'src/redux/flags';
import { getCurrentUser } from 'src/selectors/user-selectors';
import { BucketState } from 'src/types/state';
import { hasEnoughTimeAfterDismissPassed, FLAG_ID } from './index';

export type Props = {
  currentUserId?: string | null;
  showOutdatedJiraConnectorFlag: () => void;
  dismissOutdatedJiraConnectorFlag: () => void;
};

export class OutdatedJiraConnectorFlagManager extends React.Component<Props> {
  componentDidMount(): void {
    this.dispatchFlag();
  }

  componentDidUpdate(prevProps: Props) {
    const { currentUserId } = this.props;

    if (currentUserId !== prevProps.currentUserId) {
      this.dispatchFlag();
    }
  }

  componentWillUnmount(): void {
    this.props.dismissOutdatedJiraConnectorFlag();
  }

  dispatchFlag = () => {
    const { currentUserId, showOutdatedJiraConnectorFlag } = this.props;

    if (hasEnoughTimeAfterDismissPassed(currentUserId)) {
      showOutdatedJiraConnectorFlag();
    }
  };

  render(): React.ReactNode {
    return null;
  }
}

const mapStateToProps = (state: BucketState) => {
  const currentUser = getCurrentUser(state);

  return {
    currentUserId: currentUser && currentUser.uuid,
  };
};

// @ts-ignore TODO: fix noImplicitAny error here
const mapDispatchToProps = dispatch => ({
  showOutdatedJiraConnectorFlag: () => dispatch(showFlagComponent(FLAG_ID)),
  dismissOutdatedJiraConnectorFlag: () => dispatch(dismissFlag(FLAG_ID)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OutdatedJiraConnectorFlagManager);
