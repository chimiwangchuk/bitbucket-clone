import { connect } from 'react-redux';
import { BucketState } from 'src/types/state';
import {
  getPullRequestSourceHash,
  getPullRequestSourceRepo,
  getPullRequestDestinationHash,
  getPullRequestDestinationRepo,
} from 'src/redux/pull-request/selectors';
import { getIsNewSourceEnabled } from 'src/selectors/feature-selectors';
import urls from 'src/urls/source';
import { SourceViewLink, ProvidedProps } from '../components/source-view-link';

const mapStateToProps = (state: BucketState, ownProps: ProvidedProps) => {
  const { isDeleted, filepath } = ownProps;

  const repo = isDeleted
    ? getPullRequestDestinationRepo(state)
    : getPullRequestSourceRepo(state);
  const repositoryFullSlug = repo ? repo.full_name : '';

  const hash = isDeleted
    ? getPullRequestDestinationHash(state)
    : getPullRequestSourceHash(state) || '';

  const hasNewSourceEnabled = getIsNewSourceEnabled(state);

  const viewHref = urls.ui.source(repositoryFullSlug, {
    refOrHash: hash,
    path: filepath,
  });

  return {
    hasNewSourceEnabled,
    viewHref,
  };
};

export default connect(mapStateToProps, null, null, { forwardRef: true })(
  SourceViewLink
);
