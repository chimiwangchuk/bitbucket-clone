import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl, InjectedIntl } from 'react-intl';
import { Diff } from 'src/types/pull-request';
import {
  getAllConversationsForFile,
  getCommentsCountForFile,
} from 'src/selectors/conversation-selectors';
import { getDiffCommentsDialogFile } from 'src/redux/pull-request/selectors';
import { CodeReviewConversation } from 'src/components/conversation-provider/types';

import {
  FETCH_LARGE_FILE_COMMENT_CONTEXT,
  CLOSE_DIFF_COMMENTS_DIALOG,
} from 'src/redux/pull-request/actions';
import { extractFilepath } from 'src/utils/extract-file-path';

import CommentsDialog from '../../containers/comments-dialog';
import messages from './diff-comments-dialog.i18n';

type StateProps = {
  file: Diff;
  commentsCount: number;
  conversations: CodeReviewConversation[];
};

type DispatchProps = {
  onClose: () => void;
  dispatchContextLines: (file: Diff) => void;
};

type OwnProps = {
  file?: Diff;
  intl: InjectedIntl;
  onClose?: () => void;
};

type MergeProps = StateProps &
  DispatchProps &
  OwnProps & {
    fetchContextLines: () => void;
    isFileOutdated: boolean;
    heading: string;
  };

// @ts-ignore TODO: fix noImplicitAny error here
function mapStateToProps(state, ownProps: OwnProps): StateProps {
  // skip the default file selector if `file` is already present by checking
  // `ownProps` in here instead of relying on the override in `mergeProps`
  const file = ownProps.file || getDiffCommentsDialogFile(state);

  return {
    file,
    commentsCount: getCommentsCountForFile(state, { file }),
    conversations: getAllConversationsForFile(state, { file }),
  };
}

// @ts-ignore TODO: fix noImplicitAny error here
function mapDispatchToProps(dispatch): DispatchProps {
  return {
    dispatchContextLines: (file: Diff) =>
      dispatch({
        type: FETCH_LARGE_FILE_COMMENT_CONTEXT.REQUEST,
        payload: { file },
      }),
    onClose: () =>
      dispatch({
        type: CLOSE_DIFF_COMMENTS_DIALOG,
      }),
  };
}

function mergeProps(
  stateProps: StateProps,
  dispatchProps: DispatchProps,
  ownProps: OwnProps
): MergeProps {
  const { file, commentsCount } = stateProps;
  const { intl } = ownProps;
  const filepath = extractFilepath(file);

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchContextLines: () => dispatchProps.dispatchContextLines(file),
    isFileOutdated: false,
    heading: intl.formatMessage(messages.dialogHeading, {
      filepath,
      commentsCount,
    }),
  };
}

export default compose<any, any, any>(
  injectIntl,
  connect(mapStateToProps, mapDispatchToProps, mergeProps)
)(CommentsDialog);
