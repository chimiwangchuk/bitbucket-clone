import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { DropdownItem } from '@atlaskit/dropdown-menu';
import { REVERT_DIALOG } from 'src/redux/pull-request/actions';
import { PullRequest } from 'src/components/types';

import {
  getCurrentPullRequest,
  getHasDestinationBranch,
} from 'src/redux/pull-request/selectors';

import { BucketState } from 'src/types/state';
import messages from './revert-pull-request.i18n';

type Props = {
  pullRequest: PullRequest;
  hasDestinationBranch: boolean;
  openRevertDialog: () => void;
};

export function RevertPullRequest({
  openRevertDialog,
  hasDestinationBranch,
  pullRequest,
}: Props) {
  if (
    !hasDestinationBranch ||
    pullRequest.state !== 'MERGED' ||
    pullRequest.destination.repository.scm !== 'git'
  ) {
    return null;
  }

  return (
    <DropdownItem onClick={openRevertDialog}>
      <FormattedMessage {...messages.revertPullRequest} />
    </DropdownItem>
  );
}

const mapStateToProps = (state: BucketState) => ({
  pullRequest: getCurrentPullRequest(state),
  hasDestinationBranch: getHasDestinationBranch(state),
});

// @ts-ignore TODO: fix noImplicitAny error here
const mapDispatchToProps = dispatch => ({
  openRevertDialog: () => dispatch({ type: REVERT_DIALOG.OPEN }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(RevertPullRequest));
