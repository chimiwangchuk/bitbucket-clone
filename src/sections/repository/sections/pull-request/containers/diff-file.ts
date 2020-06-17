import { connect } from 'react-redux';
import { getCombinedBannerAndHorizontalNavHeight } from 'src/selectors/global-selectors';

import {
  expandContext,
  TOGGLE_DIFF_EXPANSION,
  toggleSideBySideMode,
  onEditorOpenStateChange,
  publishBasePullRequestFact,
  publishPullRequestUiEvent,
} from 'src/redux/pull-request/actions';
import { ExpandContextParams } from 'src/redux/pull-request/actions/expand-context';
import { BucketDispatch, BucketState } from 'src/types/state';
import DiffFile, {
  OwnProps,
  StateProps,
  DispatchProps,
} from '../components/diff-file';

const mapStateToProps = (state: BucketState): StateProps => {
  return {
    bannerAndNavHeight: getCombinedBannerAndHorizontalNavHeight(state, false),
  };
};

const mapDispatchToProps = (dispatch: BucketDispatch): DispatchProps => ({
  expandContext: (params: ExpandContextParams) =>
    dispatch(expandContext(params)),

  onExpand: (filepath: string, isOpening: boolean) =>
    dispatch({ type: TOGGLE_DIFF_EXPANSION, payload: { filepath, isOpening } }),

  onToggleSideBySideMode: (filePath: string, isSideBySide: boolean) => {
    dispatch(toggleSideBySideMode({ filePath, isSideBySide }));
    dispatch(
      publishBasePullRequestFact('bitbucket.pullrequests.sideBySideDiff.click')
    );
    dispatch(
      publishPullRequestUiEvent({
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'pullRequestSideBySideDiffButton',
      })
    );
  },

  onEditorOpenStateChange: (isOpen: boolean) =>
    dispatch(onEditorOpenStateChange(isOpen)),
});

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(DiffFile);
