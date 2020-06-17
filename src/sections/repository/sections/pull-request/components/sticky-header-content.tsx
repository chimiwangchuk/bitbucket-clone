import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';

import UserAvatar from 'src/containers/user-avatar';
import { getCurrentPullRequest } from 'src/redux/pull-request/selectors';
import { BucketState } from 'src/types/state';

import HeaderActions from './header-actions';
import BranchesAndState from './branches-and-state';
import * as styles from './sticky-header-content.style';

const StickyHeaderContent = () => {
  const pr = useSelector((state: BucketState) => {
    const pullRequest = getCurrentPullRequest(state) || ({} as BB.PullRequest);
    const {
      author,
      state: prState,
      created_on: createdOn,
      closed_on: closedOn,
    } = pullRequest;

    return {
      author,
      state: prState,
      createdOn,
      closedOn,
    };
  }, shallowEqual);

  if (!pr.state) {
    return null;
  }

  return (
    <styles.StickyHeaderWrapper>
      <styles.StickyHeaderContent isHeaderSticky>
        <styles.StickyHeaderAvatar>
          <UserAvatar
            profileCardPosition="bottom-start"
            user={pr.author}
            tabIndex={-1}
          />
        </styles.StickyHeaderAvatar>
        <styles.StickyHeaderBranchesAndState>
          <BranchesAndState
            tabIndex={-1}
            pullRequestState={pr.state}
            pullRequestCreatedOn={pr.createdOn}
            pullRequestClosedOn={pr.closedOn}
          />
        </styles.StickyHeaderBranchesAndState>
      </styles.StickyHeaderContent>
      <HeaderActions isHeaderSticky />
    </styles.StickyHeaderWrapper>
  );
};

export default StickyHeaderContent;
