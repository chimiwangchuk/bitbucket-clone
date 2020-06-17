import { Repository } from 'src/components/types';

/**
 * Given a repository and a hash, create a unique identifier.
 */
export default function fileTreeId(
  repository: Repository,
  hash: string
): string {
  return `${repository.uuid}:${hash}`;
}
