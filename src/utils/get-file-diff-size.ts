import { Diff } from 'src/types/pull-request';

export function getFileDiffSize(file: Diff) {
  return file.chunks.reduce((fileSize, chunk) => {
    return (
      fileSize +
      chunk.changes.reduce((chunkSize, change) => {
        return chunkSize + change.content.length;
      }, 0)
    );
  }, 0);
}
