import { connect } from 'react-redux';
import OwnersFilter from 'src/sections/dashboard/sections/repositories/components/owners-filter';

import { getRepositoryOwnersFilter } from 'src/redux/dashboard/selectors/repositories';
import {
  fetchOwners,
  fetchAndSelectOwner,
  selectOwner,
  clearFilteredOwners,
} from 'src/redux/dashboard/actions/fetch-repository-owners';
import { BucketState } from 'src/types/state';

const mapStateToProps = (state: BucketState) => {
  const {
    owners,
    isLoading,
    isError,
    selectedOwner,
  } = getRepositoryOwnersFilter(state);

  return {
    owners,
    selectedOwner,
    isLoading,
    isError,
  };
};

const mapDispatchToProps = {
  fetchOwners,
  clearFilteredOwners,
  fetchAndSelectOwner,
  selectOwner,
};

export default connect(mapStateToProps, mapDispatchToProps)(OwnersFilter);
