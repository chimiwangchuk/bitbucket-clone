import { ApiComment } from '../types';

export function extractCommentThread(
  allCommentsInOrder: ApiComment[],
  startingComment: ApiComment
): ApiComment[] {
  const threadStart = [startingComment];

  // Ordering matters for reduce, avoids sorting and full looping
  // The original fetch request ensures chronological ordering
  return allCommentsInOrder.reduce((relatives, currentComment) => {
    const { parent } = currentComment;
    const isDescendant =
      parent &&
      relatives.some(relatedComment => relatedComment.id === parent.id);

    return isDescendant ? relatives.concat(currentComment) : relatives;
  }, threadStart);
}
