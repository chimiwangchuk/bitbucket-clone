import { ComponentType } from 'react';
import { connect } from 'react-redux';
import { BucketState } from 'src/types/state';
import { getOutdatedCommentsCountForFile } from 'src/selectors/conversation-selectors';
import { Diff } from 'src/types/pull-request';
import { OutdatedCommentsButton } from '../components/outdated-comments-button';

type ContainerProps = {
  file: Diff | null | undefined;
};

const mapStateToProps = (state: BucketState, ownProps: ContainerProps) => {
  const { file } = ownProps;
  const count = file ? getOutdatedCommentsCountForFile(state, { file }) : 0;

  return {
    count,
  };
};

const OutdatedCommentsContainer: ComponentType<ContainerProps> = connect(
  mapStateToProps
)(OutdatedCommentsButton);

export default OutdatedCommentsContainer;
