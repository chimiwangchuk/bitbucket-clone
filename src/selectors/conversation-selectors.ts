import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import { denormalize } from 'normalizr';
import {
  getAllDiffFiles,
  getConversationsList,
  getFabricConversationsList,
  getDiffFiles,
  findFileInDiffFiles,
  getAllRawComments,
  PRSelector,
} from 'src/redux/pull-request/selectors';
import { DiffPaths } from 'src/utils/extract-file-path';
import {
  CodeReviewConversation,
  InlineField,
  MinimalCodeReviewConversationComment,
} from 'src/components/conversation-provider/types';
import { BucketState } from 'src/types/state';
import { user as userSchema } from 'src/sections/profile/schemas';

type ConversationType = 'global' | 'file' | 'inline';

function getConversationType(meta?: InlineField): ConversationType {
  if (!meta || !meta.path) {
    return 'global';
  }

  if (!meta.to && !meta.from) {
    return 'file';
  }

  return 'inline';
}

function getFileCacheKey(_state: never, props: { file: DiffPaths }) {
  const { file } = props;
  const cacheKey = `${file.from}->${file.to}`;
  return cacheKey;
}

export const getFabricConversations = createSelector(
  getFabricConversationsList,
  fabricConversations =>
    (fabricConversations || []).sort((a, b) => {
      if (a.createdAt === b.createdAt) {
        return 0;
      }

      return a.createdAt < b.createdAt ? -1 : 1;
    })
);

export const getConversations = createSelector(
  getConversationsList,
  conversations =>
    (conversations || []).sort((a, b) => {
      if (a.createdAt === b.createdAt) {
        return 0;
      }

      return a.createdAt < b.createdAt ? -1 : 1;
    })
);

export const getAuthorAccountIdsForComments = createCachedSelector(
  (state: BucketState) => state,
  (_state: never, comments: MinimalCodeReviewConversationComment[]) => comments,
  (
    { entities }: BucketState,
    comments: MinimalCodeReviewConversationComment[]
  ) => {
    const idMap = new Map();
    comments
      .map(comment => comment.authorUuid)
      .forEach(uuid => {
        if (uuid) {
          const denormalizedUser = denormalize(uuid, userSchema, entities);
          if (denormalizedUser) {
            idMap.set(uuid, denormalizedUser.account_id);
          }
        }
      });
    return idMap;
  }
)((_state, comments: MinimalCodeReviewConversationComment[]) => {
  const commentIds = comments.map(comment => comment.id);
  return `${Math.min(...commentIds)}-${Math.max(...commentIds)}`;
});

export type CommentsMetaData = {
  permalink: string;
  filepath: string;
  isOutdated: boolean;
};

export const getCommentsMetaData: PRSelector<CommentsMetaData[]> = createSelector(
  getAllRawComments,
  conversations => {
    const commentsMetaData: CommentsMetaData[] = [];

    conversations.forEach(conversation => {
      const { path: filepath, outdated: isOutdated } =
        conversation.inline || ({} as InlineField);
      commentsMetaData.push({
        permalink: `comment-${conversation.id}`,
        filepath: filepath || '',
        isOutdated: !!isOutdated,
      });
    });
    return commentsMetaData;
  }
);

export const isCommentFileForPermalinkAvailable = createCachedSelector(
  getCommentsMetaData,
  getAllDiffFiles,
  (_state: never, permalink: string) => permalink,
  (commentsMetaData, diffFiles, permalink) => {
    const metadata = commentsMetaData.find(
      data => data.permalink === permalink
    );
    if (!metadata) {
      return false;
    }
    return !!findFileInDiffFiles(diffFiles, metadata.filepath);
  }
)((_state, permalink) => permalink);

export const isCommentFileForPermalinkHiddenByLimits = createCachedSelector(
  getCommentsMetaData,
  getAllDiffFiles,
  getDiffFiles,
  (_state: never, permalink: string) => permalink,
  (commentsMetaData, diffFiles, limitedDiffFiles, permalink) => {
    const metadata = commentsMetaData.find(
      data => data.permalink === permalink
    );
    if (!metadata) {
      return false;
    }
    return (
      !findFileInDiffFiles(limitedDiffFiles, metadata.filepath) &&
      !!findFileInDiffFiles(diffFiles, metadata.filepath)
    );
  }
)((_state, permalink) => permalink);

export const getAllConversationsForFile = createCachedSelector(
  getConversations,
  (_state: never, props: { file: DiffPaths }) => props.file,
  (conversations, file) => {
    const filterByFile = (convo: CodeReviewConversation) => {
      const hasFileTo = file.to !== '/dev/null' && file.to !== undefined;
      const pathToMatch = hasFileTo ? file.to : file.from;
      return convo.meta && convo.meta.path === pathToMatch;
    };

    return (conversations || []).filter(filterByFile);
  }
)(getFileCacheKey);

export const getFileLevelConversationsForFile = createCachedSelector(
  getAllConversationsForFile,
  conversations => {
    const isFileLevel = (convo: CodeReviewConversation) =>
      convo.meta && !convo.meta.to && !convo.meta.from;

    return (conversations || []).filter(isFileLevel);
  }
)(getFileCacheKey);

export const getValidConversationsForFile = createCachedSelector(
  getAllConversationsForFile,
  fileConversations => fileConversations.filter(convo => !convo.meta.outdated)
)(getFileCacheKey);

export const getInlineConversationsForFile = createCachedSelector(
  getValidConversationsForFile,
  validConversations =>
    validConversations.filter(
      convo => getConversationType(convo.meta) === 'inline'
    )
)(getFileCacheKey);

export const getOutdatedConversationsForFile = createCachedSelector(
  getAllConversationsForFile,
  fileConversations => fileConversations.filter(convo => convo.meta.outdated)
)(getFileCacheKey);

export const getOutdatedCommentsCountForFile = createSelector(
  getOutdatedConversationsForFile,
  outdatedConversations =>
    outdatedConversations.reduce(
      (count, convo) => count + convo.numOfComments,
      0
    )
);

export const getCommentsCountForFile = createSelector(
  getAllConversationsForFile,
  fileConversations =>
    fileConversations.reduce((count, convo) => count + convo.numOfComments, 0)
);

export const getConversationsGlobal = createSelector(
  getConversations,
  conversations => conversations.filter(c => Object.keys(c.meta).length === 0)
);
