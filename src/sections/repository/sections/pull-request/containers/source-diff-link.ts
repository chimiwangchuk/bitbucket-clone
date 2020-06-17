import { connect } from 'react-redux';
import { BucketState } from 'src/types/state';
import {
  getPullRequestSourceHash,
  getPullRequestDestinationHash,
} from 'src/redux/pull-request/selectors';
import { getCurrentRepositoryFullSlug } from 'src/selectors/repository-selectors';
import { getIsNewSourceEnabled } from 'src/selectors/feature-selectors';
import urls from 'src/urls/source';
import { SourceViewLink, ProvidedProps } from '../components/source-view-link';

type MappedStateProps = { hasNewSourceEnabled: boolean; viewHref: string };

const mapStateToProps = (
  state: BucketState,
  ownProps: ProvidedProps
): MappedStateProps => {
  const repositoryFullSlug = getCurrentRepositoryFullSlug(state) || '';
  const prSource = getPullRequestSourceHash(state);
  const prDestination = getPullRequestDestinationHash(state);
  const hasNewSourceEnabled = getIsNewSourceEnabled(state);

  // Code Review and Source have opposite concepts of source/destination
  const spec = {
    source: prDestination || '',
    destination: prSource || '',
  };

  const viewHref = urls.ui.diff(repositoryFullSlug, ownProps.filepath, spec);

  return {
    hasNewSourceEnabled,
    viewHref,
  };
};

const preventImplictDispatchAccess = () => ({});

export default connect<MappedStateProps>(
  mapStateToProps,
  preventImplictDispatchAccess
)(SourceViewLink);
