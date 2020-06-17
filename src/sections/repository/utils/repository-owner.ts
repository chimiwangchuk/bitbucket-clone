import { get } from 'lodash-es';
import { Repository } from 'src/components/types';
import {
  getProfileUrl,
  getAvatarUrl,
  getName,
} from 'src/components/user-profile';

export const getRepoOwnerAvatarUrl = (
  repository: Repository | null | undefined
) => {
  if (!repository) {
    return undefined;
  }
  if (repository.workspace) {
    return get(repository, 'workspace.links.avatar.href', undefined);
  }
  return getAvatarUrl(repository.owner);
};

export const getRepoOwnerName = (repository: Repository | null | undefined) => {
  if (!repository) {
    return undefined;
  }
  if (repository.workspace) {
    return repository.workspace.name;
  } else if (repository.owner) {
    return getName(repository.owner);
  } else {
    return repository.full_name.split('/')[0];
  }
};

export const getRepoOwnerUrl = (repository: Repository | null | undefined) => {
  if (!repository) {
    return undefined;
  }
  if (repository.workspace) {
    return get(repository, 'workspace.links.html.href', undefined);
  }
  return getProfileUrl(repository.owner);
};
