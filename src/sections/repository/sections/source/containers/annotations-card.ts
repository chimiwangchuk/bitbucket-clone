import { connect } from 'react-redux';
import { BucketState } from 'src/types/state';
import AnnotationsCard from '../components/annotations-card';

const mapStateToProps = (state: BucketState) => ({
  isAnnotationsFeatureEnabled:
    state.global.features['connect-source-annotations'],
  annotators: state.repository.source.annotations.annotators,
  annotations: state.repository.source.annotations.annotations,
  isLoadingAnnotations:
    state.repository.source.annotations.isLoadingAnnotations,
});

export default connect(mapStateToProps)(AnnotationsCard);
