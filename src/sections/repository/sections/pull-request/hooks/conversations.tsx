import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { ModalTransition } from '@atlaskit/modal-dialog';
import { DiffContent, OnAddCommentArgs } from '@atlassian/bitkit-diff';

import {
  getInlineConversationsForFile,
  getOutdatedCommentsCountForFile,
} from 'src/selectors/conversation-selectors';
import { getCurrentUserIsAnonymous } from 'src/selectors/user-selectors';
import { Diff as DiffType } from 'src/types/pull-request';
import { BucketState } from 'src/types/state';
import { extractFilepath } from 'src/utils/extract-file-path';

import diffMessages from '../components/diff.i18n';
import DiscardCommentsDialog, {
  useDiscardCommentsDialogState,
} from '../components/discard-comments-dialog';
import { NewPullRequestConversation } from '../components/new-pull-request-conversation';
import { PullRequestConversation } from '../components/pull-request-conversation';

type ConversationMeta = {
  file: DiffType;
  lineFrom: string | number | undefined;
  lineTo: string | number | undefined;
};

function isNewConversationForThisLine(
  newConvoMeta: ConversationMeta | null,
  fileName: string,
  diffLine: DiffContent
) {
  // check if this is an invalid conversation or a file-level conversation
  // (which shouldn't be rendered inline and won't have a 'from' and 'to' field)
  if (
    !newConvoMeta ||
    !newConvoMeta.file ||
    (!newConvoMeta.lineFrom && !newConvoMeta.lineTo)
  ) {
    return false;
  }

  return (
    (newConvoMeta.file.to === fileName ||
      newConvoMeta.file.from === fileName) &&
    newConvoMeta.lineTo === diffLine.lineTo &&
    newConvoMeta.lineFrom === diffLine.lineFrom
  );
}

type UseConversationsOptions = {
  diff: DiffType;
  editorPopupsMountPointRef: React.MutableRefObject<HTMLElement | null>;
  onInlineEditorClose?: () => void;
  onInlineEditorOpen?: () => void;
};

export const useConversations = (options: UseConversationsOptions) => {
  const {
    diff,
    editorPopupsMountPointRef,
    onInlineEditorClose,
    onInlineEditorOpen,
  } = options;

  const [
    newConversationMeta,
    setNewConversationMeta,
  ] = useState<ConversationMeta | null>(null);

  const conversationSelectorInput = useMemo(() => ({ file: diff }), [diff]);

  const conversations = useSelector((state: BucketState) =>
    getInlineConversationsForFile(state, conversationSelectorInput)
  );
  const isAnonymousUser = useSelector(getCurrentUserIsAnonymous);
  const outdatedConversationsCount = useSelector((state: BucketState) =>
    getOutdatedCommentsCountForFile(state, conversationSelectorInput)
  );

  const filepath = extractFilepath(diff);
  const isEditorOpen = !!newConversationMeta;

  useEffect(() => {
    setNewConversationMeta(null);
  }, [
    conversations.length,
    outdatedConversationsCount,
    setNewConversationMeta,
  ]);

  const {
    confirmDiscardComments,
    dialogProps,
    isDialogOpen,
  } = useDiscardCommentsDialogState();

  const handleAddInlineComment = useCallback(
    (line: OnAddCommentArgs) => {
      const addInlineComment = () =>
        setNewConversationMeta({
          file: diff,
          lineTo: line.to,
          lineFrom: line.from,
        });

      // We only want 1 editor for creating a new inline conversation thread to be open at any given time
      if (isEditorOpen) {
        confirmDiscardComments({
          message: diffMessages.discardCommentsModalBody__SameFileComment,
          onConfirmDiscard: () => {
            addInlineComment();
          },
        });
      } else {
        addInlineComment();
      }
    },
    [confirmDiscardComments, diff, isEditorOpen, setNewConversationMeta]
  );

  const handleEditorCancel = useCallback(() => {
    setNewConversationMeta(null);
  }, [setNewConversationMeta]);

  /* HOW THIS WORKS:
   * This function gets called EVERY time a code line is rendered or re-rendered,
   * and also for rendering file-level conversations.  Right now it's called *twice*
   * per code line - needs to be fixed.
   *
   * Note that a `newConversation` refers specifically to a new root level Conversation,
   * not a reply to an existing comment.
   */
  const renderInlineConversations = useCallback(
    (diffLine: DiffContent) => {
      const newConversationIsForThisLine = isNewConversationForThisLine(
        newConversationMeta,
        filepath,
        diffLine
      );

      const { lineTo, lineFrom } = diffLine;
      const inlineConversations = conversations.filter(convo => {
        const { to, from } = convo.meta;
        return (!!lineTo && to === lineTo) || (!!lineFrom && from === lineFrom);
      });

      // Nothing to render
      if (!inlineConversations.length && !newConversationIsForThisLine) {
        return null;
      }

      const newConversation = newConversationMeta && (
        <NewPullRequestConversation
          meta={{
            path: filepath,
            to: diffLine.lineTo,
            from: diffLine.lineFrom,
          }}
          popupMountElement={editorPopupsMountPointRef.current}
          onEditorOpen={onInlineEditorOpen}
          onEditorClose={onInlineEditorClose}
          onCancel={handleEditorCancel}
        />
      );

      return (
        <Fragment>
          {inlineConversations.map(conversation => (
            <PullRequestConversation
              key={filepath}
              conversation={conversation}
              meta={{
                path: filepath,
                to: diffLine.lineTo || diffLine.lineFrom,
              }}
              popupMountElement={editorPopupsMountPointRef.current}
              onEditorOpen={onInlineEditorOpen}
              onEditorClose={onInlineEditorClose}
            />
          ))}
          {newConversationIsForThisLine && newConversation}
        </Fragment>
      );
    },
    [
      conversations,
      editorPopupsMountPointRef,
      filepath,
      handleEditorCancel,
      onInlineEditorClose,
      onInlineEditorOpen,
      newConversationMeta,
    ]
  );

  const discardCommentsModal = useMemo(
    () => (
      <ModalTransition>
        {isDialogOpen && <DiscardCommentsDialog {...dialogProps} />}
      </ModalTransition>
    ),
    [dialogProps, isDialogOpen]
  );

  return {
    discardCommentsModal,
    onAddInlineComment: isAnonymousUser ? undefined : handleAddInlineComment,
    renderInlineConversations,
  };
};
