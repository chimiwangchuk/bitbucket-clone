import React from 'react';
import { useSelector } from 'react-redux';

import { BranchInfoDialog } from 'src/components/ref-label';
import { useIntl } from 'src/hooks/intl';
import {
  getRepoOwnerAvatarUrl,
  getRepoOwnerName,
  getRepoOwnerUrl,
} from 'src/sections/repository/utils/repository-owner';
import { Repository } from 'src/components/types';
import {
  getIsDifferentRepo,
  getPullRequestSourceRepo,
  getPullRequestBranchName,
} from 'src/redux/pull-request/selectors';
import urls from 'src/urls';
import { getIsWorkspaceUiEnabled } from 'src/selectors/feature-selectors';

import messages from './source-ref-label.i18n';

function getSourceRepoBasedProps(sourceRepo: Repository | null | undefined) {
  if (sourceRepo) {
    return {
      scm: sourceRepo.scm || 'git',
      repoName: sourceRepo.name,
      repoHref: sourceRepo.links.html.href,
      repoAvatarSrc: sourceRepo.links.avatar.href,
      repoOwnerAvatarSrc: getRepoOwnerAvatarUrl(sourceRepo),
      repoOwnerHref: getRepoOwnerUrl(sourceRepo),
      repoOwnerName: getRepoOwnerName(sourceRepo),
    };
  }

  return {};
}

type OwnProps = {
  tabIndex?: number;
};

export default function SourceRefLabel(ownProps: OwnProps) {
  const intl = useIntl();

  const sourceBranchName = useSelector(getPullRequestBranchName);
  const sourceRepo = useSelector(getPullRequestSourceRepo);
  const isDifferentRepo = useSelector(getIsDifferentRepo);
  const isWorkspaceUiEnabled = useSelector(getIsWorkspaceUiEnabled);
  const sourceBasedProps = getSourceRepoBasedProps(sourceRepo);

  const repoName = sourceRepo ? sourceRepo.full_name : '';
  const deletedRepoMessage = intl.formatMessage(messages.deletedRepository);
  const description = isDifferentRepo
    ? `${repoName || deletedRepoMessage}:${sourceBranchName}`
    : sourceBranchName;

  const [owner, slug] = repoName.split('/');

  // Somewhat hacky since we'd hope to get these links from the API
  const branchHref =
    owner && slug ? urls.ui.branch(owner, slug, sourceBranchName) : undefined;

  return (
    <BranchInfoDialog
      {...sourceBasedProps}
      branchHref={branchHref}
      branchName={sourceBranchName}
      isWorkspaceUiEnabled={isWorkspaceUiEnabled}
      description={description}
      {...ownProps}
    />
  );
}
