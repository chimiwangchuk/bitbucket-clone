import qs from 'qs';
import { CloneProtocol } from '../types';

export function getCloneUrl(
  protocol: CloneProtocol,
  repository?: BB.Repository
): string | undefined {
  const cloneLink =
    repository && repository.links.clone.find(link => link.name === protocol);
  if (!cloneLink) {
    return undefined;
  }
  return cloneLink.href;
}

export function getCloneCommand(
  protocol: CloneProtocol,
  repo?: BB.Repository
): string | undefined {
  const cloneUrl = getCloneUrl(protocol, repo);
  if (!repo || !repo.scm || !cloneUrl) {
    return undefined;
  }
  return `${repo.scm} clone ${cloneUrl}`;
}

type SourcetreeUrlParams = {
  cloneUrl: string;
  type: 'bitbucket';
  user?: string;
};

export function getSourcetreeCloneUrl(
  protocol: CloneProtocol,
  repo?: BB.Repository,
  user?: BB.User
): string | undefined {
  const cloneUrl = getCloneUrl(protocol, repo);
  if (!cloneUrl) {
    return undefined;
  }

  const params: SourcetreeUrlParams = {
    cloneUrl,
    type: 'bitbucket',
  };
  if (user) {
    params.user = user.username;
  }
  return `sourcetree://cloneRepo?${qs.stringify(params)}`;
}

type XcodeUrlParams = {
  repo: string;
};

export function getXcodeCloneUrl(
  protocol: CloneProtocol,
  repo?: BB.Repository
): string | undefined {
  const cloneUrl = getCloneUrl(protocol, repo);
  if (!cloneUrl) {
    return undefined;
  }
  const params: XcodeUrlParams = {
    repo: cloneUrl,
  };
  return `xcode://clone?${qs.stringify(params)}`;
}
