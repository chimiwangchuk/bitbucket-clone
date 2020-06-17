import { connect } from 'react-redux';

import {
  getRepositoryListSlice,
  getRepositoriesPagination,
} from 'src/redux/dashboard/selectors/repositories';

import { SCROLL_TO_TOP_DURATION } from 'src/constants/permalink-scroll';
import scrollTo from 'src/redux/global/actions/scroll-to';

import { Pagination } from 'src/components/pagination';

// @ts-ignore TODO: fix noImplicitAny error here
const mapStateToProps = (state, ownProps) => {
  const { isLoading, isError } = getRepositoryListSlice(state);
  const pages = getRepositoriesPagination(state)(ownProps.getPaginationUrl);

  return {
    isLoading,
    pages,
    isError,
    uiEventSource: 'repositoryDashboardScreen',
    uiEventSubjectId: 'repositoryDashboardPagination',
  };
};

// @ts-ignore TODO: fix noImplicitAny error here
const mapDispatchToProps = dispatch => ({
  onPageChange: () =>
    dispatch(
      scrollTo({
        targetId: 'root',
        duration: SCROLL_TO_TOP_DURATION,
      })
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Pagination);
