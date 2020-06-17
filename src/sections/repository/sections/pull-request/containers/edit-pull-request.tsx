import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { DropdownItem } from '@atlaskit/dropdown-menu';

import { getCurrentPullRequestId } from 'src/redux/pull-request/selectors';
import pullRequestUrls from 'src/redux/pull-request/urls';
import {
  getCurrentRepositoryOwnerName,
  getCurrentRepositorySlug,
} from 'src/selectors/repository-selectors';
import { BucketState } from 'src/types/state';
import messages from '../components/header-actions/header-actions.i18n';

const mapStateToProps = (state: BucketState) => {
  const repoOwner = getCurrentRepositoryOwnerName(state);
  const repoSlug = getCurrentRepositorySlug(state);
  const pullRequestId = getCurrentPullRequestId(state);

  const href =
    repoOwner && repoSlug && pullRequestId
      ? pullRequestUrls.ui.edit(repoOwner, repoSlug, pullRequestId)
      : '#';

  return {
    children: <FormattedMessage {...messages.editPullRequestAction} />,
    href,
  };
};

export default connect(mapStateToProps)(DropdownItem);
