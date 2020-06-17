import { v20 } from 'src/urls/source/v20';
import { DiffStatStatus } from 'src/types/diffstat';
import { GetSourceUrlsParams, SourceUrls } from './types';

export function getSourceUrls({
  sourceHash,
  destinationHash,
  fileDiffStatus,
  file,
  repoFullName,
}: GetSourceUrlsParams): SourceUrls {
  let afterUrl = '';
  let beforeUrl = '';

  switch (fileDiffStatus) {
    case DiffStatStatus.Added: {
      afterUrl = v20.source(repoFullName, sourceHash, file.to);
      break;
    }
    case DiffStatStatus.Removed: {
      beforeUrl = v20.source(repoFullName, destinationHash, file.from);
      break;
    }
    // Merge conflicts are currently being rendered as a side-by-side
    // modified diff but will be redesigned in a future ticket.
    // https://softwareteams.atlassian.net/browse/COREX-1186
    case DiffStatStatus.BinaryConflict: // Fallthrough
    case DiffStatStatus.Modified: {
      beforeUrl = v20.source(repoFullName, destinationHash, file.to);
      afterUrl = v20.source(repoFullName, sourceHash, file.from);
      break;
    }
  }

  return {
    afterUrl,
    beforeUrl,
  };
}
