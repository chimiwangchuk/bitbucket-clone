import React from 'react';
import { connect } from 'react-redux';
import { CLOSE_NONRENDERED_DIFF_COMMENTS_DIALOG } from 'src/redux/pull-request/actions';
import { getNonRenderedDiffCommentsDialogFile } from 'src/redux/pull-request/selectors';
import { Diff } from 'src/types/pull-request';
import { DiffCommentsDialog } from './diff-comments-dialog';

type Props = {
  file: Diff;
};

type DispatchProps = {
  onClose: () => void;
};

type StateProps = {
  file: Diff;
};

const NonRenderedDiffCommentsDialog = (props: Props) => {
  // Lay the groundwork for paginated or partial diffs, where we might need to fetch
  // the file's diff asynchronously because we don't have it upfront
  if (!props.file) {
    return null;
  }
  return <DiffCommentsDialog {...props} />;
};

// @ts-ignore TODO: fix noImplicitAny error here
const mapStateToProps = (state): StateProps => ({
  file: getNonRenderedDiffCommentsDialogFile(state),
});

// @ts-ignore TODO: fix noImplicitAny error here
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onClose: () =>
    dispatch({
      type: CLOSE_NONRENDERED_DIFF_COMMENTS_DIALOG,
    }),
});

export default connect<StateProps>(
  mapStateToProps,
  mapDispatchToProps
)(NonRenderedDiffCommentsDialog);
