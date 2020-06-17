import { createSelector } from 'reselect';
import {
  getConflicts,
  getRenderedDiffStat,
} from 'src/redux/pull-request/selectors';
import { getConversations } from 'src/selectors/conversation-selectors';
import { diffStatToFileTree } from 'src/utils/diffstat-transformer';
import { DiffStat, AnnotatedDiffStat } from 'src/types/diffstat';
import { extractFilepath } from 'src/utils/extract-file-path';

// @ts-ignore TODO: fix noImplicitAny error here
const addConflictMarkers = (diffStat, conflicts): AnnotatedDiffStat[] =>
  diffStat.map(
    (stat: DiffStat): AnnotatedDiffStat => {
      const filepath = extractFilepath(stat);
      // @ts-ignore TODO: fix noImplicitAny error here
      const hasConflict = conflicts.find(c => c.path === filepath);

      return { ...stat, isConflicted: !!hasConflict };
    }
  );

// @ts-ignore TODO: fix noImplicitAny error here
const addCommentCounts = (diffStat, conversations) =>
  // @ts-ignore TODO: fix noImplicitAny error here
  diffStat.map(stat => {
    const filepath = extractFilepath(stat);

    const conversationsForFile = conversations.filter(
      // @ts-ignore TODO: fix noImplicitAny error here
      conversation => filepath === conversation.meta.path
    );

    const totalComments = conversationsForFile.reduce(
      // @ts-ignore TODO: fix noImplicitAny error here
      (runningCount, currentConversation) =>
        runningCount + currentConversation.numOfComments,
      0
    );
    return { ...stat, comments: totalComments };
  });

export const getFileTree = createSelector(
  getRenderedDiffStat,
  getConflicts,
  getConversations,
  (diffStat, conflicts = [], conversations = []) => {
    if (!diffStat) {
      return null;
    }

    let annotatedDiffStat = addConflictMarkers(diffStat, conflicts);
    annotatedDiffStat = addCommentCounts(annotatedDiffStat, conversations);
    return diffStatToFileTree(annotatedDiffStat);
  }
);
