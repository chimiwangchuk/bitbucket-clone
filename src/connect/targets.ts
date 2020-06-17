import repoUrls from 'src/sections/repository/urls';
import sourceUrls from 'src/urls/source';
import commitUrls from 'src/urls/commit';

export type RepositoryTargetProps = {
  repositoryOwner: string;
  repositorySlug: string;
};

export type RepositoryTarget = {
  type: string;
  full_name: string;
  name: string;
  links: {
    self: {
      href: string;
    };
  };
  uuid?: string;
};

export const repositoryTarget = ({
  repositoryOwner,
  repositorySlug,
}: RepositoryTargetProps): RepositoryTarget => ({
  type: 'repository',
  full_name: `${repositoryOwner}/${repositorySlug}`,
  name: repositorySlug,
  links: {
    self: {
      href: repoUrls.api.v20.repositoryAbs(repositoryOwner, repositorySlug),
    },
  },
});

export type CommitFileTargetProps = {
  path: string;
  hash: string;
  repositoryOwner: string;
  repositorySlug: string;
};

export const commitFileTarget = ({
  path,
  hash,
  repositoryOwner,
  repositorySlug,
}: CommitFileTargetProps) => ({
  type: 'commit_file',
  path,
  commit: {
    type: 'commit',
    hash,
    repository: repositoryTarget({
      repositoryOwner,
      repositorySlug,
    }),
  },
  links: {
    self: {
      href: sourceUrls.api.v20.sourceAbs(
        `${repositoryOwner}/${repositorySlug}`,
        hash,
        path
      ),
    },
  },
});

export const commitDirectoryTarget = (props: CommitFileTargetProps) => ({
  ...commitFileTarget(props),
  type: 'commit_directory',
});

export type BranchTargetProps = {
  repositoryOwner: string;
  repositorySlug: string;
  name: string;
};

export const branchTarget = ({
  name,
  repositoryOwner,
  repositorySlug,
}: BranchTargetProps) => ({
  type: 'branch',
  name,
  repository: repositoryTarget({
    repositoryOwner,
    repositorySlug,
  }),
  links: {
    self: {
      href: repoUrls.api.v20.branchAbs(repositoryOwner, repositorySlug, name),
    },
  },
});

export type CommitTargetProps = {
  repositoryOwner: string;
  repositorySlug: string;
  hash: string;
};

export const commitTarget = ({
  repositoryOwner,
  repositorySlug,
  hash,
}: CommitTargetProps) => ({
  type: 'commit',
  hash,
  repository: repositoryTarget({
    repositoryOwner,
    repositorySlug,
  }),
  links: {
    self: {
      href: commitUrls.api.v20.commitAbs(
        `${repositoryOwner}/${repositorySlug}`,
        hash
      ),
    },
  },
});
