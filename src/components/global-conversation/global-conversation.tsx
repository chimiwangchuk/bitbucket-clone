import React, { Fragment, useContext, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import Panel from '@atlaskit/panel';
import { editorProps } from 'src/components/conversation-provider/editor-props';
import {
  FabricComment,
  CommentLikes,
} from 'src/components/conversation-provider/types';
import { handleImageUpload } from 'src/redux/pull-request/bitbucket-image-upload-handler';
import { TOGGLE_CREATE_COMMENT_TASK_INPUT } from 'src/redux/pull-request/actions';
import * as pageStyles from 'src/sections/global/components/page.style';
import ConversationsContext from 'src/contexts/conversations-context';
import Loader from 'src/components/loading';
import { useIntl } from 'src/hooks/intl';
import { isSameCommentPermalink } from 'src/utils/permalink-helpers';
import { canModerateComments } from 'src/utils/moderate-comments';
import { RepositoryPrivilege } from 'src/sections/repository/types';
import { useCreateJiraIssueAction } from 'src/sections/repository/sections/jira/hooks/use-create-jira-issue-action';
import { getSelectedCommentText } from 'src/sections/repository/utils/selected-comment-text';
import messages from 'src/sections/repository/sections/pull-request/components/pull-request-conversation.i18n';
import {
  PullRequestCommentLikeButton,
  PullRequestCommentLikers,
} from 'src/sections/repository/sections/pull-request/components/comment-likes/comment-likes';
import { getCurrentUser } from 'src/selectors/user-selectors';
import {
  getCommentLikers,
  toggleCommentLikeAction,
} from 'src/sections/repository/sections/pull-request/components/comment-likes/utils';
import { AfterCommentItems } from 'src/sections/repository/sections/pull-request/components/after-comment-items';
import Conversation from './conversation';
import * as styles from './global-conversation.style';

type ConversationsGlobalProps = {
  containerId: string;
  conversation: any;
  isLoading: boolean;
  onPermalinkHashChange?: (permalink: string) => void;
  showCreateCommentTaskInput?: (comment: Comment) => void;
  userAccessLevel?: RepositoryPrivilege;
  canCreateTask?: boolean;
  canLikeComments?: boolean;
  commentLikes?: CommentLikes[];
};

const ConversationsGlobal = (props: ConversationsGlobalProps) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const currentUser = useSelector(getCurrentUser);

  const { conversationProvider, additionalConversationProviders } = useContext(
    ConversationsContext
  );

  const {
    conversation,
    containerId,
    isLoading,
    userAccessLevel,
    canCreateTask,
    canLikeComments,
    commentLikes,
  } = props;
  const conversationId = conversation ? conversation.conversationId : null;
  const placeholder = intl.formatMessage(messages.commentsGlobalAddComment);

  const imageUploadHandler = useCallback(
    (event, editorCallback) =>
      dispatch(handleImageUpload(event, editorCallback)),
    [dispatch]
  );

  const conversationsGlobalTitle = (
    <pageStyles.PanelHeader>
      <FormattedMessage
        {...messages.commentsGlobalTitle}
        values={{ count: conversation ? conversation.numOfComments : 0 }}
      />
    </pageStyles.PanelHeader>
  );

  const Wrapper = conversation ? styles.ConversationWrapper : Fragment;

  const handleOnCommentPermalinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    commentId: string
  ) => {
    if (isSameCommentPermalink(commentId)) {
      // prevent incorrect browser scrolling if a user clicks the permalink more than once
      event.preventDefault();
      if (props.onPermalinkHashChange) {
        props.onPermalinkHashChange(`comment-${commentId}`);
      }
    }
  };

  const handleOnCreateTaskActionClick = (comment: FabricComment) => {
    const { commentId } = comment;
    const selectedCommentText = getSelectedCommentText(commentId);
    dispatch({
      type: TOGGLE_CREATE_COMMENT_TASK_INPUT,
      payload: {
        commentId,
        isCreating: true,
        selectedCommentText,
      },
    });
  };

  const createJiraIssue = useCreateJiraIssueAction();
  // @ts-ignore TODO: fix noImplicitAny error here
  const renderAdditionalCommentActions = (CommentAction, comment) => {
    const commentActions: JSX.Element[] = [];

    const { commentId } = comment;

    const handleOnLikeCommentActionClick = () =>
      dispatch(toggleCommentLikeAction(commentId, commentLikes, currentUser));

    // Create like action
    if (canLikeComments) {
      commentActions.push(
        <CommentAction onClick={handleOnLikeCommentActionClick}>
          <PullRequestCommentLikeButton
            commentId={commentId}
            commentLikes={commentLikes}
            currentUser={currentUser}
          />
        </CommentAction>
      );
    }
    if (getCommentLikers(comment.commentId, commentLikes).length !== 0) {
      commentActions.push(
        <CommentAction>
          <PullRequestCommentLikers
            commentId={commentId}
            commentLikes={commentLikes}
          />
        </CommentAction>
      );
    }

    // Create task action
    if (canCreateTask) {
      commentActions.push(
        <CommentAction
          key="create-task"
          onClick={() => handleOnCreateTaskActionClick(comment)}
        >
          {intl.formatMessage(messages.createTaskLabel)}
        </CommentAction>
      );
    }

    // Create Jira issue action
    if (createJiraIssue.isVisible) {
      commentActions.push(
        <div data-testid="pr-comment-create-jira-issue-action">
          <CommentAction
            onClick={() =>
              createJiraIssue.onClick({
                commentId: comment.commentId,
                isVisible: true,
              })
            }
          >
            {createJiraIssue.label}
          </CommentAction>
        </div>
      );
    }

    return commentActions;
  };

  const renderEditor = useCallback(
    (Editor, ownProps) => (
      <Editor
        {...ownProps}
        {...editorProps}
        legacyImageUploadProvider={Promise.resolve(imageUploadHandler)}
      />
    ),
    [imageUploadHandler]
  );

  return (
    <pageStyles.PageSection
      data-qa="conversations-global-style"
      aria-label={intl.formatMessage(messages.globalConversationLabel)}
    >
      <Panel header={conversationsGlobalTitle} isDefaultExpanded>
        <Wrapper>
          {/* This toggle is currently a necessity so that Conversation unmounts its internal Store */}
          {isLoading ? (
            <Loader size="large" />
          ) : (
            <Conversation
              // Updates key to cause re-mount when comment likes change. Can be removed after COREX-2058
              key={`conversation-with-comments-likes-${JSON.stringify(
                commentLikes
              )}`}
              // @ts-ignore onCommentPermalinkClick is not documented
              onCommentPermalinkClick={handleOnCommentPermalinkClick}
              showBeforeUnloadWarning
              provider={conversationProvider}
              id={conversationId}
              objectId={containerId}
              placeholder={placeholder}
              // @ts-ignore fix this in subsequent editor upgrade by ensuring single version of editor-common
              dataProviders={additionalConversationProviders}
              allowFeedbackAndHelpButtons
              renderEditor={renderEditor}
              renderAdditionalCommentActions={renderAdditionalCommentActions}
              renderAfterComment={AfterCommentItems}
              canModerateComments={canModerateComments(userAccessLevel)}
            />
          )}
        </Wrapper>
      </Panel>
    </pageStyles.PageSection>
  );
};

export default React.memo(ConversationsGlobal);
