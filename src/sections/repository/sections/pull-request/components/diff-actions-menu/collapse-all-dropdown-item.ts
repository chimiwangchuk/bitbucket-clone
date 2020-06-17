import { ReactNode } from 'react';
import { connect } from 'react-redux';
import { DropdownItem } from '@atlaskit/dropdown-menu';
import { BucketDispatch } from 'src/types/state';
import {
  COLLAPSE_ALL_DIFFS,
  publishPullRequestUiEvent,
} from 'src/redux/pull-request/actions';

const mapDispatchToProps = (dispatch: BucketDispatch) => ({
  onClick: () => {
    dispatch({ type: COLLAPSE_ALL_DIFFS });
    dispatch(
      publishPullRequestUiEvent({
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'pullRequestCollapseFilesButton',
      })
    );
  },
});

export default connect<{}, {}, { children?: ReactNode }>(
  null,
  mapDispatchToProps
)(DropdownItem);
