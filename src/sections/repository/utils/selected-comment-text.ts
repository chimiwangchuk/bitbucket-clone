export function getSelectedCommentText(commentId: number) {
  const selection = window.getSelection();
  const commentContainer = document.getElementById(`comment-${commentId}`);
  if (!selection || selection.isCollapsed || !commentContainer) {
    return '';
  }

  if (commentContainer.contains(selection.anchorNode)) {
    return selection.toString().trim();
  }

  return '';
}
