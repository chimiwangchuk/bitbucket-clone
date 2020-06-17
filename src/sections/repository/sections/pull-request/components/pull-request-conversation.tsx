import React, { useCallback } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Conversation as AkConversation } from '@atlaskit/conversation';
import { Comment as AkConversationCommentType } from '@atlaskit/conversation/dist/esm/model';
import { doc, p, mention } from '@atlaskit/adf-utils';
import { providerFactory } from 'src/components/fabric-html-renderer';
import { BaseConversation as Conversation } from 'src/components/global-conversation';
import { isSameCommentPermalink } from 'src/utils/permalink-helpers';
import {
  onPermalinkHashChange,
  TOGGLE_CREATE_COMMENT_TASK_INPUT,
} from 'src/redux/pull-request/actions';
import { canModerateComments } from 'src/utils/moderate-comments';
import { BucketState } from 'src/types/state';
import {
  getContainerId,
  getCanLikeComments,
  getCommentLikes,
} from 'src/redux/pull-request/selectors';
import { getRepositoryAccessLevel } from 'src/selectors/repository-selectors';
import { getCanCreateTask } from 'src/selectors/task-selectors';
import {
  CodeReviewConversation,
  CommentLikes,
} from 'src/components/conversation-provider/types';
import { RepositoryPrivilege } from 'src/sections/repository/types';
import ConversationsContext from 'src/contexts/conversations-context';
import { editorProps } from 'src/components/conversation-provider/editor-props';
import { handleImageUpload } from 'src/redux/pull-request/bitbucket-image-upload-handler';
import { useCreateJiraIssueAction } from 'src/sections/repository/sections/jira/hooks/use-create-jira-issue-action';
import { useIntl } from 'src/hooks/intl';
import { getSelectedCommentText } from 'src/sections/repository/utils/selected-comment-text';
import { getAuthorAccountIdsForComments } from 'src/selectors/conversation-selectors';
import { getCurrentUser } from 'src/selectors/user-selectors';
import messages from './pull-request-conversation.i18n';
import {
  PullRequestCommentLikeButton,
  PullRequestCommentLikers,
} from './comment-likes/comment-likes';
import {
  getCommentLikers,
  toggleCommentLikeAction,
} from './comment-likes/utils';
import { AfterCommentItems } from './after-comment-items';

// For comments inside pull request files, we want the max level of comment nesting
// to be 1 - i.e. the root level comments and then 1 level of reply underneath the
// root level comments. This is implemented inside the @atlaskit/conversation component,
// so Frontbucket just needs to supply the max nesting level as a number.
const MAX_CONVERSATION_NESTING = 1;

type AkConvoProps = JSX.LibraryManagedAttributes<
  typeof AkConversation,
  AkConversation['props']
>;

type OwnProps = Partial<AkConvoProps> & {
  conversation?: CodeReviewConversation;
  popupMountElement?: HTMLElement | null;
  meta: {
    path: string;
    to?: number;
    from?: number;
  };
};

type StateProps = {
  containerId: string;
  userAccessLevel?: RepositoryPrivilege;
  canCreateTask?: boolean;
  canLikeComments?: boolean;
  commentLikes?: CommentLikes[];
  commentAuthorAccountIds: Map<string, string> | undefined;
};

type Props = OwnProps & StateProps;

const mapStateToProps = (
  state: BucketState,
  ownProps: OwnProps
): StateProps => {
  const { comments } = { ...ownProps.conversation };

  return {
    containerId: getContainerId(state),
    userAccessLevel: getRepositoryAccessLevel(state),
    canCreateTask: getCanCreateTask(state),
    canLikeComments: getCanLikeComments(state),
    commentLikes: getCommentLikes(state, comments),
    commentAuthorAccountIds: ownProps.conversation
      ? getAuthorAccountIdsForComments(state, ownProps.conversation.comments)
      : undefined,
  };
};

export const mentionForCommentAuthor = (
  comment: AkConversationCommentType,
  commentAuthorAccountIds: Map<string, string>
) => {
  let adfMention: {} | undefined = undefined;
  if (comment && comment.createdBy.id) {
    const commentAuthorAccountId = commentAuthorAccountIds.get(
      comment.createdBy.id
    );
    if (commentAuthorAccountId) {
      adfMention = doc(
        p(
          mention({
            id: `{${commentAuthorAccountId}}`,
            text: comment.createdBy.name,
            userType: 'DEFAULT',
          }),
          ' '
        )
      );
    }
  }
  return adfMention;
};

export const BasePullRequestConversation = ({
  containerId,
  conversation = {} as CodeReviewConversation,
  userAccessLevel,
  popupMountElement,
  canCreateTask,
  canLikeComments,
  commentLikes,
  commentAuthorAccountIds,
  ...otherProps
}: Props) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const currentUser = useSelector(getCurrentUser);

  const handleOnCommentPermalinkClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, commentId: string) => {
      if (isSameCommentPermalink(commentId)) {
        // prevent incorrect browser scrolling if a user clicks the permalink more than once
        event.preventDefault();
        dispatch(onPermalinkHashChange(`comment-${commentId}`));
      }
    },
    [dispatch]
  );

  const renderCustomizedEditor = useCallback(
    (Editor, props, comment?: AkConversationCommentType) => {
      return (
        <Editor
          {...props}
          {...editorProps}
          defaultValue={
            !props.defaultValue &&
            commentAuthorAccountIds &&
            comment &&
            comment.createdBy.id !== currentUser?.uuid &&
            comment.nestedDepth !== 0
              ? mentionForCommentAuthor(comment, commentAuthorAccountIds)
              : props.defaultValue
          }
          popupsMountPoint={popupMountElement}
          // @ts-ignore TODO: fix noImplicitAny error here
          legacyImageUploadProvider={Promise.resolve((event, editorCallback) =>
            dispatch(handleImageUpload(event, editorCallback))
          )}
        />
      );
    },
    [popupMountElement, dispatch, commentAuthorAccountIds, currentUser]
  );

  const createJiraIssue = useCreateJiraIssueAction();
  // @ts-ignore TODO: fix noImplicitAny error here
  const renderAdditionalCommentActions = (CommentAction, comment) => {
    const commentActions: JSX.Element[] = [];

    const { commentId } = comment;

    const handleOnCreateTaskActionClick = () => {
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
          onClick={() => handleOnCreateTaskActionClick()}
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

  // Intentionally undefined if we're creating a new comment or replying
  const { conversationId } = conversation;

  return (
    <ConversationsContext.Consumer>
      {({ conversationProvider }) => {
        return (
          <Conversation
            // Updates key to cause re-mount when comment likes change. Can be removed after COREX-2058
            key={`conversation-with-comments-likes-${JSON.stringify(
              commentLikes
            )}`}
            id={conversationId}
            showBeforeUnloadWarning
            allowFeedbackAndHelpButtons
            provider={conversationProvider}
            objectId={containerId}
            isExpanded={false}
            // @ts-ignore fix this in subsequent editor upgrade by ensuring single version of editor-common
            dataProviders={providerFactory}
            renderEditor={renderCustomizedEditor}
            // @ts-ignore canModerateComments is not documented yet?
            canModerateComments={canModerateComments(userAccessLevel)}
            onCommentPermalinkClick={handleOnCommentPermalinkClick}
            renderAdditionalCommentActions={renderAdditionalCommentActions}
            maxCommentNesting={MAX_CONVERSATION_NESTING}
            renderAfterComment={AfterCommentItems}
            {...otherProps}
          />
        );
      }}
    </ConversationsContext.Consumer>
  );
};

const Memoized = React.memo(BasePullRequestConversation);
export const PullRequestConversation = connect(mapStateToProps)(Memoized);
