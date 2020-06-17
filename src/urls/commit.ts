import { stringify } from 'qs';
import repoUrls from 'src/sections/repository/urls';
import settings from 'src/settings';

const urls = {
  api: {
    internal: {
      commitsBuildStatuses: (repositoryFullSlug: string) => {
        const url = `/!api/internal/repositories/${repositoryFullSlug}/commits/statuses/`;
        const fields = ['updated_on', 'description', 'name'];
        const query = stringify({
          fields: fields.map(f => `+*.commit_status.${f}`).join(','),
        });

        return `${url}?${query}`;
      },
      commits: (repositoryFullSlug: string) =>
        `/!api/internal/repositories/${repositoryFullSlug}/changesets`,

      commit: (repositoryFullSlug: string, commitHash: string) =>
        `/!api/internal/repositories/${repositoryFullSlug}/changeset/${commitHash}`,

      watch: (repositoryFullSlug: string, commitHash: string) =>
        `/!api/internal/repositories/${repositoryFullSlug}/changesets/${commitHash}/watch`,
    },
    v20: {
      commit: (repositoryFullSlug: string, commitHash: string) =>
        `/!api/2.0/repositories/${repositoryFullSlug}/commit/${commitHash}`,

      commitAbs: (repositoryFullSlug: string, commitHash: string) =>
        `${settings.CANON_URL}${urls.api.v20.commit(
          repositoryFullSlug,
          commitHash
        )}`,

      statuses: (repositoryFullSlug: string, commitHash: string) =>
        `/!api/2.0/repositories/${repositoryFullSlug}/commit/${commitHash}/statuses?pagelen=100`,

      approve: (repositoryFullSlug: string, commitHash: string) =>
        `/!api/2.0/repositories/${repositoryFullSlug}/commit/${commitHash}/approve`,

      participants: (repositoryFullSlug: string, commitHash: string) =>
        `/!api/2.0/repositories/${repositoryFullSlug}/commit/${commitHash}?fields=participants`,

      diffStat: (
        repositoryFullSlug: string,
        nextCommitHash: string,
        parentCommitHash?: string
      ) => {
        const baseUrl = `/!api/2.0/repositories/${repositoryFullSlug}/diffstat`;
        if (parentCommitHash) {
          return `${baseUrl}/${parentCommitHash}..${nextCommitHash}`;
        }
        return `${baseUrl}/${nextCommitHash}`;
      },

      tags: (repositoryFullSlug: string) =>
        `/!api/2.0/repositories/${repositoryFullSlug}/refs/tags`,

      comments: (repoUrl: string, commitHash: string) =>
        `/!api/2.0/repositories/${repoUrl}/commit/${commitHash}/comments?pagelen=100`,

      comment: (repoUrl: string, commitHash: string, commentId: string) =>
        `/!api/2.0/repositories/${repoUrl}/commit/${commitHash}/comments/${commentId}`,
    },
  },
  external: {
    commitListEmptyStateLearnHow: 'https://confluence.atlassian.com/x/8QhODQ',
  },
  ui: {
    commits: (repositoryFullSlug: string) => {
      const [owner, slug] = repositoryFullSlug.split('/');
      return `${repoUrls.ui.repository(owner, slug)}/commits`;
    },
    rawCommit: (repositoryFullSlug: string, commitHash: string) => {
      const [owner, slug] = repositoryFullSlug.split('/');
      return `${repoUrls.ui.repository(owner, slug)}/commits/${commitHash}/raw`;
    },
    unmappedCommitAuthor: (repositoryFullSlug: string, username: string) => {
      const query = {
        username,
      };
      return `/${repositoryFullSlug}/admin/committers?${stringify(query)}`;
    },
  },
};

export default urls;
