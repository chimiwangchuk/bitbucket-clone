import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { getIsWorkspaceUiEnabled } from 'src/selectors/feature-selectors';
import { BucketState } from 'src/types/state';
import BaseReviewers, { ReviewersProps } from 'src/components/reviewers';
import { getCurrentUserKey } from 'src/selectors/user-selectors';

type OwnProps = ReviewersProps;

type StateProps = {
  currentUserUuid: string | undefined;
  isWorkspaceUiEnabled: boolean;
};

type Props = OwnProps & StateProps;

class Reviewers extends PureComponent<Props> {
  render() {
    const {
      currentUserUuid,
      isWorkspaceUiEnabled,
      ...reviewersProps
    } = this.props;

    return (
      <BaseReviewers
        {...reviewersProps}
        currentUserUuid={currentUserUuid}
        removeLinksToProfiles={isWorkspaceUiEnabled}
      />
    );
  }
}

const mapStateToProps = (state: BucketState): StateProps => ({
  currentUserUuid: getCurrentUserKey(state) || undefined,
  isWorkspaceUiEnabled: getIsWorkspaceUiEnabled(state),
});

export default connect<StateProps, Props>(mapStateToProps)(Reviewers);
