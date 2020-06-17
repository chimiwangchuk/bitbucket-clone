import React from 'react';
import ArrowRightIcon from '@atlaskit/icon/glyph/arrow-right';
import { PullRequestState } from 'src/components/types';
import SourceRefLabel from '../containers/source-ref-label';
import DestinationRefLabel from '../containers/destination-ref-label';
import StateLozenge from './state-lozenge';
import * as styles from './branches-and-state.style';

type BranchesAndStateProps = {
  pullRequestState: PullRequestState;
  pullRequestCreatedOn: string;
  pullRequestClosedOn: string | null | undefined;
  tabIndex?: number;
};

function BranchesAndState(props: BranchesAndStateProps) {
  const {
    pullRequestState,
    pullRequestCreatedOn,
    pullRequestClosedOn,
    tabIndex,
  } = props;

  return (
    <styles.BranchesAndState data-qa="pr-branches-and-state-styles">
      <styles.ItemWrapper>
        <SourceRefLabel tabIndex={tabIndex} />
      </styles.ItemWrapper>
      <styles.ItemWrapper>
        <ArrowRightIcon label="to" size="small" />
      </styles.ItemWrapper>
      <styles.ItemWrapper>
        <DestinationRefLabel tabIndex={tabIndex} />
      </styles.ItemWrapper>
      <StateLozenge
        data-qa="state-lozenge"
        pullRequestState={pullRequestState}
        pullRequestCreatedOn={pullRequestCreatedOn}
        pullRequestClosedOn={pullRequestClosedOn}
      />
    </styles.BranchesAndState>
  );
}

export default React.memo(BranchesAndState);
