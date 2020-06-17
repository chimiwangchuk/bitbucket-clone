import { connect } from 'react-redux';

import { BranchInfoDialog } from 'src/components/ref-label';
import {
  getRepoOwnerAvatarUrl,
  getRepoOwnerName,
  getRepoOwnerUrl,
} from 'src/sections/repository/utils/repository-owner';
import { BucketState } from 'src/types/state';
import {
  getIsDifferentRepo,
  getPullRequestDestinationRepo,
  getDestinationBranchName,
} from 'src/redux/pull-request/selectors';
import { getIsWorkspaceUiEnabled } from 'src/selectors/feature-selectors';
import urls from 'src/urls';

const buildDescription = (
  repoName: string,
  branchName: string,
  isDifferentRepo?: boolean
) => (isDifferentRepo ? `${repoName}:${branchName}` : branchName);

const mapStateToProps = (state: BucketState) => {
  const destBranchName = getDestinationBranchName(state);
  const destRepo = getPullRequestDestinationRepo(state);
  const isDifferentRepo = getIsDifferentRepo(state);

  const description = buildDescription(
    destRepo ? destRepo.full_name : '',
    destBranchName,
    isDifferentRepo
  );

  const [owner, slug] = (destRepo ? destRepo.full_name : '').split('/');

  return {
    branchName: destBranchName,
    // Somewhat hacky since we'd hope to get these links from the API
    branchHref: urls.ui.branch(owner, slug, destBranchName),
    isWorkspaceUiEnabled: getIsWorkspaceUiEnabled(state),
    scm: (destRepo && destRepo.scm) || 'git',
    repoName: destRepo && destRepo.name,
    repoHref: destRepo && destRepo.links.html.href,
    repoAvatarSrc: destRepo && destRepo.links.avatar.href,
    repoOwnerAvatarSrc: getRepoOwnerAvatarUrl(destRepo),
    repoOwnerHref: getRepoOwnerUrl(destRepo),
    repoOwnerName: getRepoOwnerName(destRepo),
    description,
  };
};

export default connect(mapStateToProps)(BranchInfoDialog);
