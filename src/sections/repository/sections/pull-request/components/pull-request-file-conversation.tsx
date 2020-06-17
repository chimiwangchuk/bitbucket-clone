import React, { useCallback } from 'react';
import { connect, useDispatch } from 'react-redux';
import * as styles from '@atlassian/bitkit-diff/styles';

import { BucketState } from 'src/types/state';
import { Diff } from 'src/types/pull-request';
import { getFileLevelConversationsForFile } from 'src/selectors/conversation-selectors';
import { CodeReviewConversation } from 'src/components/conversation-provider/types';
import { extractFilepath } from 'src/utils/extract-file-path';
import { CLOSE_FILE_COMMENT } from 'src/redux/pull-request/actions';
import { PullRequestConversation } from './pull-request-conversation';
import { NewPullRequestConversation } from './new-pull-request-conversation';

type OwnProps = {
  file: Diff;
  onCancel?: () => void;
  onEditorClose?: () => void;
  popupMountElement?: HTMLElement | null;
};

type StateProps = {
  isCommenting: boolean;
  conversations: CodeReviewConversation[];
};

type Props = OwnProps & StateProps;

const mapStateToProps = (state: BucketState, ownProps: OwnProps) => {
  const filepath = extractFilepath(ownProps.file);

  return {
    isCommenting: !!state.repository.pullRequest.diffCommentingMap[filepath],
    conversations: getFileLevelConversationsForFile(state, ownProps),
  };
};

const NOOP = () => {};
// @ts-ignore TODO: fix noImplicitAny error here
const EMPTY_ARR = [];

export const BasePullRequestFileConversation = ({
  file,
  isCommenting = false,
  onCancel = NOOP,
  onEditorClose = NOOP,
  // @ts-ignore TODO: fix noImplicitAny error here
  conversations = EMPTY_ARR,
}: Props) => {
  const path = extractFilepath(file);
  const dispatch = useDispatch();
  const handleCancel = useCallback(() => {
    dispatch({ type: CLOSE_FILE_COMMENT, payload: path });
    onCancel();
  }, [dispatch, path, onCancel]);

  return conversations.length === 0 && !isCommenting ? null : (
    <styles.TopLevelInlineContent>
      <styles.InlineContentContainer>
        <React.Fragment>
          {conversations.map(conversation => (
            // @ts-ignore onCommentPermalinkClick isnt documented
            <PullRequestConversation
              key={`${conversation.conversationId}-${conversation.createdAt}`}
              conversation={conversation}
              meta={{
                path,
              }}
            />
          ))}
          {isCommenting && (
            <NewPullRequestConversation
              onCancel={handleCancel}
              onEditorClose={onEditorClose}
              meta={{
                path: extractFilepath(file),
              }}
            />
          )}
        </React.Fragment>
      </styles.InlineContentContainer>
    </styles.TopLevelInlineContent>
  );
};

const Memoized = React.memo(BasePullRequestFileConversation);
export const PullRequestFileConversation = connect(mapStateToProps)(Memoized);
