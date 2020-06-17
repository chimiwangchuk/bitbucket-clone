import React, { ReactNode } from 'react';
import { connect } from 'react-redux';

import { getRepositoryPageLoadingStatus } from 'src/selectors/global-selectors';
import ErrorPage from 'src/components/error-page';
import ErrorCodes from 'src/constants/error-codes';
import { BucketState } from 'src/types/state';
import { LoadingStatus } from 'src/constants/loading-status';

export type Props = {
  repositoryPageLoadingStatus: {
    status: LoadingStatus;
    statusCode?: ErrorCodes;
  };
  children: ReactNode;
};

export class PageLoadingErrorGuard extends React.PureComponent<Props> {
  render() {
    const {
      children,
      repositoryPageLoadingStatus: { status, statusCode },
    } = this.props;

    return status === LoadingStatus.Failed ? (
      <ErrorPage statusCode={statusCode} />
    ) : (
      children
    );
  }
}

const mapStateToProps = (state: BucketState) => ({
  repositoryPageLoadingStatus: getRepositoryPageLoadingStatus(state),
});

export default connect(mapStateToProps)(PageLoadingErrorGuard);
