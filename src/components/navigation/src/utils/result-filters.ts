import { RepositoryGlobalSearchResult } from '../types';

const slugPattern = /^([^\s]+)\/(.*)$/;

function getPredicate(input: string) {
  const query = input.toLowerCase();
  const match = slugPattern.exec(query);
  if (match) {
    // When the query contains a slash, we allow for some more precise
    // filtering where the part before the slash matches only on the owner and
    // the part after it on the slug. The name can also include a slash so
    // match the full query on it too.
    const owner = match[1];
    const repo = match[2];
    return (r: RepositoryGlobalSearchResult) =>
      (r.owner.indexOf(owner) !== -1 && r.slug.indexOf(repo) !== -1) ||
      r.name.toLowerCase().indexOf(query) !== -1;
  } else {
    // Filter on any property of the repo. All the parts of the query need
    // to match in at least one of the properties. This allows for some
    // fuzziness when it comes to the order of words.
    const parts = query.split(/[/\s]+/).filter(s => !!s.length);
    return (r: RepositoryGlobalSearchResult) =>
      parts.every(
        s =>
          r.owner.indexOf(s) !== -1 ||
          r.slug.indexOf(s) !== -1 ||
          r.name.toLowerCase().indexOf(s) !== -1
      );
  }
}

export function filterRepositories(
  repositories: RepositoryGlobalSearchResult[],
  query: string,
  limit: number
) {
  const predicate = getPredicate(query);

  const results: RepositoryGlobalSearchResult[] = [];
  for (const r of repositories) {
    if (predicate(r)) {
      results.push(r);
      if (results.length === limit) {
        break;
      }
    }
  }
  return results;
}
