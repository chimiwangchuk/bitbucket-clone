export default (text: string): string => {
  const firstLineEnd = text.indexOf('\n');
  if (firstLineEnd === -1) {
    return text;
  }
  return text.substring(0, firstLineEnd);
};
