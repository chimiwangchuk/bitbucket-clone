import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import ModalDialog, { ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';
import Button from '@atlaskit/button';
import Lozenge from '@atlaskit/lozenge';
// @ts-ignore TODO: fix noImplicitAny error here
import diffParser from '@atlassian/diffparser';
import AKSpinner from '@atlaskit/spinner';
import Diff from '@atlassian/bitkit-diff';
import File from '@atlassian/bitkit-file';
import { handleImageUpload } from 'src/redux/pull-request/bitbucket-image-upload-handler';
import { editorProps } from 'src/components/conversation-provider/editor-props';
import { BaseConversation as Conversation } from 'src/components/global-conversation';
import { providerFactory } from 'src/components/fabric-html-renderer';
import FabricUserAvatar from 'src/containers/fabric-user-avatar';
import FabricUserName from 'src/containers/fabric-user-name';
import {
  getContainerId,
  getOutdatedCommentsDialogFile,
} from 'src/redux/pull-request/selectors';
import {
  getAllConversationsForFile,
  getOutdatedConversationsForFile,
} from 'src/selectors/conversation-selectors';
import { getRepositoryAccessLevel } from 'src/selectors/repository-selectors';
import { BucketState, BucketDispatch } from 'src/types/state';
import ConversationsContext from 'src/contexts/conversations-context';
import { Diff as DiffType } from 'src/types/pull-request';
import {
  extractFilepath,
  extractPrevFilepath,
} from 'src/utils/extract-file-path';
import { canModerateComments } from 'src/utils/moderate-comments';
import { commonMessages } from 'src/i18n';

import { CodeReviewConversation } from 'src/components/conversation-provider/types';
import {
  FETCH_OUTDATED_COMMENT_CONTEXT,
  CLOSE_OUTDATED_COMMENTS_DIALOG,
  SCROLL_TO_COMMENT_IN_MODAL,
  onEditorOpenStateChange,
} from 'src/redux/pull-request/actions';
import { DiffEntry } from 'src/components/diff/types';
import { RepositoryPrivilege } from 'src/sections/repository/types';
import {
  WithCreateJiraIssueAction,
  CreateJiraIssueActionType,
} from 'src/sections/repository/sections/jira/hooks/use-create-jira-issue-action';
import { isFileLevelComment } from 'src/redux/pull-request/utils/comments';
import { getGlobalIsColorBlindModeEnabled } from 'src/redux/pull-request-settings';
import { getIsWordWrapEnabled } from 'src/selectors/feature-selectors';
import DiscardCommentsDialog from '../../components/discard-comments-dialog';
import { AfterCommentItems } from '../../components/after-comment-items';
import * as styles from './comments-dialog.style';
import messages from './comments-dialog.i18n';

const PROFILE_CARD_PORTAL_ID = 'comments-dialog-profile-card-portal';

type StateProps = {
  file: DiffType;
  isFileOutdated: boolean;
  containerId: string;
  conversations: CodeReviewConversation[];
  userAccessLevel?: RepositoryPrivilege;
  isWordWrapEnabled: boolean;
  isColorBlindModeEnabled: boolean;
};

type DispatchProps = {
  onClose: () => void;
  dispatchContextLines: (file?: DiffType) => void;
  // @ts-ignore TODO: fix noImplicitAny error here
  imageUploadHandler: (event, editorCallback) => void;
  scrollToCommentInDialog: () => void;
  onEditorOpenStateChange: (isOpen: boolean) => void;
};

type MergeProps = StateProps &
  DispatchProps & {
    fetchContextLines: () => void;
  };

type OwnProps = {
  heading?: string;
};

type CommentsDialogProps = MergeProps & OwnProps;

type CommentsDialogState = {
  showDiscardCommentsDialog: boolean;
};

const mapStateToProps = (state: BucketState): StateProps => {
  const { file, isFileOutdated } = getOutdatedCommentsDialogFile(state);

  // An "outdated" file can have conversations that aren't outdated
  // so we grab all conversations for that file
  const conversations = isFileOutdated
    ? getAllConversationsForFile(state, { file })
    : getOutdatedConversationsForFile(state, { file });

  return {
    file,
    isFileOutdated,
    userAccessLevel: getRepositoryAccessLevel(state),
    containerId: getContainerId(state),
    conversations,
    isWordWrapEnabled: getIsWordWrapEnabled(state),
    isColorBlindModeEnabled: getGlobalIsColorBlindModeEnabled(state),
  };
};

const mapDispatchToProps = (dispatch: BucketDispatch): DispatchProps => {
  return {
    onClose: () => dispatch({ type: CLOSE_OUTDATED_COMMENTS_DIALOG }),
    imageUploadHandler: (event, editorCallback) =>
      // @ts-ignore Thunk usage
      dispatch(handleImageUpload(event, editorCallback)),
    dispatchContextLines: file =>
      dispatch({
        type: FETCH_OUTDATED_COMMENT_CONTEXT.REQUEST,
        payload: { file },
      }),
    scrollToCommentInDialog: () =>
      dispatch({ type: SCROLL_TO_COMMENT_IN_MODAL }),
    onEditorOpenStateChange: isOpen =>
      dispatch(onEditorOpenStateChange(isOpen)),
  };
};

const mergeProps = (
  stateProps: StateProps,
  dispatchProps: DispatchProps,
  ownProps: OwnProps
): MergeProps => {
  const { file } = stateProps;

  return {
    ...stateProps,
    ...dispatchProps,
    fetchContextLines: () => dispatchProps.dispatchContextLines(file),
    ...ownProps,
  };
};

export class CommentsDialog extends Component<
  CommentsDialogProps,
  CommentsDialogState
> {
  state = {
    showDiscardCommentsDialog: false,
  };

  componentDidMount() {
    this.props.fetchContextLines();
  }

  componentDidUpdate() {
    // We want to make sure that after we re-fetch conversations e.g.
    // pull request reload flag, to be able to re-run contextLines fetching
    // while we see this dialog
    if (this.shouldFetchContextLines()) {
      this.props.fetchContextLines();
    }
  }

  numEditorsOpen = 0;

  hideMoreLinesInDiff = (diff: DiffType): DiffEntry => ({
    chunks: diff.chunks.map(chunk => ({
      ...chunk,
      extra: {
        before: {
          hasMoreLines: false,
          isLoading: false,
        },
        after: {
          hasMoreLines: false,
          isLoading: false,
        },
      },
    })),
  });

  getDiffsForConversation = (
    conversation: CodeReviewConversation
  ): DiffEntry | null => {
    if (conversation.meta && conversation.meta.context_lines) {
      const parsedDiffs = diffParser(conversation.meta.context_lines);
      if (parsedDiffs && parsedDiffs[0]) {
        return this.hideMoreLinesInDiff(parsedDiffs[0]);
      }
    }
    return null;
  };

  isContextLinesAvailable = () =>
    this.props.conversations.filter(
      conversation =>
        conversation.meta &&
        conversation.meta.context_lines !== undefined &&
        !isFileLevelComment(conversation)
    ).length > 0;

  shouldFetchContextLines = () => {
    const { conversations } = this.props;

    return (
      !conversations.every(convo => !!isFileLevelComment(convo)) &&
      !this.isContextLinesAvailable()
    );
  };

  handleOnOpenComplete = () => {
    this.props.scrollToCommentInDialog();
  };

  handleEditorOpen = () => {
    this.numEditorsOpen++;
    this.props.onEditorOpenStateChange(true);
  };

  handleEditorClose = () => {
    this.numEditorsOpen--;
    if (!this.numEditorsOpen) {
      this.props.onEditorOpenStateChange(false);
    }
  };

  handleClose = () => {
    if (this.numEditorsOpen > 0) {
      this.setState({ showDiscardCommentsDialog: true });
    } else {
      this.props.onClose();
    }
  };

  handleDiscardComments = () => {
    this.setState({ showDiscardCommentsDialog: false });
    this.props.onClose();
  };

  handleDiscardCommentsCancel = () => {
    this.setState({ showDiscardCommentsDialog: false });
  };

  render() {
    const {
      conversations,
      containerId,
      heading,
      imageUploadHandler,
      file,
      isFileOutdated,
      userAccessLevel,
      isWordWrapEnabled,
      isColorBlindModeEnabled,
    } = this.props;
    const { showDiscardCommentsDialog } = this.state;

    if (!file) {
      return null;
    }

    const filepath = extractFilepath(file);
    const loading = this.shouldFetchContextLines();
    const modalHeading = heading || <FormattedMessage {...messages.title} />;

    const Header = () => (
      <styles.Header>
        <ModalHeader showKeyline>
          {/* very strange @emotion/styled ts issue
          //@ts-ignore */}
          <ModalTitle>{modalHeading}</ModalTitle>
        </ModalHeader>
      </styles.Header>
    );

    const Footer = () => (
      <styles.RightAlignedFooter showKeyline>
        <Button appearance="primary" onClick={this.handleClose}>
          <FormattedMessage {...commonMessages.close} />
        </Button>
      </styles.RightAlignedFooter>
    );

    const renderAdditionalCommentActions = (
      // @ts-ignore TODO: fix noImplicitAny error here
      CommentAction,
      // @ts-ignore TODO: fix noImplicitAny error here
      comment,
      createJiraIssueAction: CreateJiraIssueActionType
    ) => {
      const commentActions: JSX.Element[] = [];

      // Create Jira issue action
      if (createJiraIssueAction.isVisible) {
        commentActions.push(
          <div data-testid="pr-comment-create-jira-issue-action">
            <CommentAction
              onClick={() =>
                createJiraIssueAction.onClick({
                  commentId: comment.commentId,
                  isVisible: true,
                })
              }
            >
              {createJiraIssueAction.label}
            </CommentAction>
          </div>
        );
      }

      return commentActions;
    };

    // @ts-ignore TODO: fix noImplicitAny error here
    const renderConversation = (conversation, conversationProvider) => (
      <WithCreateJiraIssueAction>
        {createJiraIssueAction => (
          <Conversation
            key={conversation.conversationId}
            showBeforeUnloadWarning
            id={conversation.conversationId}
            portalParentId={PROFILE_CARD_PORTAL_ID}
            provider={conversationProvider}
            meta={{ path: filepath, to: file.to || file.from }}
            objectId={containerId}
            isExpanded={false}
            dataProviders={providerFactory}
            allowFeedbackAndHelpButtons
            onEditorOpen={this.handleEditorOpen}
            onEditorClose={this.handleEditorClose}
            renderEditor={(Editor, props) => (
              <Editor
                {...props}
                {...editorProps}
                legacyImageUploadProvider={Promise.resolve(imageUploadHandler)}
              />
            )}
            renderAdditionalCommentActions={(CommentAction, comment) =>
              renderAdditionalCommentActions(
                CommentAction,
                comment,
                createJiraIssueAction
              )
            }
            renderAfterComment={AfterCommentItems}
            // @ts-ignore canModerateComments is undocumented on Conversation
            canModerateComments={canModerateComments(userAccessLevel)}
          />
        )}
      </WithCreateJiraIssueAction>
    );

    const renderInLineConversation = (
      // @ts-ignore TODO: fix noImplicitAny error here
      content,
      // @ts-ignore TODO: fix noImplicitAny error here
      conversation,
      // @ts-ignore TODO: fix noImplicitAny error here
      conversationProvider
    ) => {
      if (content) {
        return content.lineTo === conversation.meta.to ||
          content.lineFrom === conversation.meta.from
          ? renderConversation(conversation, conversationProvider)
          : null;
      } else {
        return null;
      }
    };

    const renderInDiffConversation = (
      // @ts-ignore TODO: fix noImplicitAny error here
      diff,
      // @ts-ignore TODO: fix noImplicitAny error here
      conversation,
      // @ts-ignore TODO: fix noImplicitAny error here
      conversationProvider
    ) => (
      <File
        filePath={conversation.meta.path}
        prevFilePath={extractPrevFilepath(file)}
        isCollapsible={false}
        toggleExpanded={() => {}}
        renderBeforeActions={() =>
          isFileOutdated && (
            <Lozenge appearance="moved">
              <FormattedMessage {...messages.fileHeaderLozenge} />
            </Lozenge>
          )
        }
      >
        <Diff
          filePath={conversation.meta.path}
          diff={diff}
          isSideBySide={false}
          onShowMoreLines={() => {}}
          isWordWrapEnabled={isWordWrapEnabled}
          inlineContent={content =>
            renderInLineConversation(
              content,
              conversation,
              conversationProvider
            )
          }
          isColorBlindModeEnabled={isColorBlindModeEnabled}
        />
      </File>
    );

    return (
      <ConversationsContext.Consumer>
        {context => (
          <>
            <ModalDialog
              onClose={this.handleClose}
              autoFocus={false}
              shouldCloseOnEscapePress={false}
              header={Header}
              footer={Footer}
              width="x-large"
              onOpenComplete={this.handleOnOpenComplete}
            >
              <div id={PROFILE_CARD_PORTAL_ID} />
              <styles.Container>
                {loading && (
                  <styles.LoadingContainer>
                    <AKSpinner size="medium" />
                  </styles.LoadingContainer>
                )}
                {!loading &&
                  conversations.map(conversation => {
                    const { createdBy } = conversation;
                    const diff = this.getDiffsForConversation(conversation);
                    const diffConversation = diff
                      ? renderInDiffConversation(
                          diff,
                          conversation,
                          context.conversationProvider
                        )
                      : renderConversation(
                          conversation,
                          context.conversationProvider
                        );
                    return (
                      <styles.ConversationContainer
                        key={conversation.conversationId}
                      >
                        <FabricUserAvatar size="medium" user={createdBy} />
                        <styles.Conversation>
                          <styles.Subtitle>
                            <FormattedMessage
                              {...messages.subtitle}
                              values={{
                                name: <FabricUserName user={createdBy} />,
                              }}
                            />
                          </styles.Subtitle>
                          {diffConversation}
                        </styles.Conversation>
                      </styles.ConversationContainer>
                    );
                  })}
              </styles.Container>
            </ModalDialog>

            {showDiscardCommentsDialog && (
              <DiscardCommentsDialog
                onCancel={this.handleDiscardCommentsCancel}
                onDiscard={this.handleDiscardComments}
              >
                <FormattedMessage
                  {...messages.discardCommentsModalBody}
                  tagName="p"
                  values={{
                    outdatedCommentsDialogTitle: (
                      <FormattedMessage {...messages.title} tagName="em" />
                    ),
                  }}
                />
              </DiscardCommentsDialog>
            )}
          </>
        )}
      </ConversationsContext.Consumer>
    );
  }
}

export default connect<StateProps, DispatchProps, OwnProps, MergeProps>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(CommentsDialog);
