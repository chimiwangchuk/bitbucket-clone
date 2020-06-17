import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import InlineDialog from '@atlaskit/inline-dialog';

import { getCurrentPullRequestError } from 'src/redux/pull-request/selectors';
import { getIsOffline } from 'src/selectors/global-selectors';
import { BucketDispatch, BucketState } from 'src/types/state';
import { HIDE_ERROR_DIALOG } from 'src/redux/pull-request/actions';

import messages from './error-dialog.i18n';

const mapStateToProps = (state: BucketState) => {
  const getError = getCurrentPullRequestError(state);
  const isOffline = getIsOffline(state);
  const isOpen = state.repository.pullRequest.isErrorDialogOpen;

  const content =
    getError && isOffline ? (
      <FormattedMessage {...messages.couldNotConnect} />
    ) : (
      getError
    );

  return {
    content,
    isOpen,
    placement: 'bottom',
  };
};

const mapDispatchToProps = (dispatch: BucketDispatch) => ({
  onClose: () => dispatch({ type: HIDE_ERROR_DIALOG }),
});

export default connect(mapStateToProps, mapDispatchToProps)(InlineDialog);
