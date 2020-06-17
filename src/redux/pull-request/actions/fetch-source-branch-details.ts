import { stringify } from 'qs';

import { fetchAction } from 'src/redux/actions';
import urls from 'src/sections/repository/urls';

import { FETCH_SOURCE_BRANCH_DETAILS } from './constants';

const fetchSourceBranchDetails = (
  repositoryOwner: string,
  repositorySlug: string,
  branchName: string
) => {
  const query = stringify({
    branch: branchName,
  });
  const url = `${urls.api.internal.branchList(
    repositoryOwner,
    repositorySlug
  )}?${query}`;

  return fetchAction(FETCH_SOURCE_BRANCH_DETAILS, { url });
};

export default fetchSourceBranchDetails;
