import repoUrls from 'src/sections/repository/urls';

export const ui = {
  pullrequest: (owner: string, slug: string, pullRequestId: number) =>
    `${repoUrls.ui.repository(owner, slug)}/pull-requests/${pullRequestId}`,

  oldpullrequest: (owner: string, slug: string, pullRequestId: number) =>
    `${repoUrls.ui.repository(
      owner,
      slug
    )}/pull-requests/${pullRequestId}?spa=0`,

  pullrequests: (owner: string, slug: string) =>
    `${repoUrls.ui.repository(owner, slug)}/pull-requests`,

  pullrequestdata: (owner: string, slug: string, pullRequestId: number) =>
    `${repoUrls.ui.repository(
      owner,
      slug
    )}/pull-requests/${pullRequestId}?state=view`,

  edit: (owner: string, slug: string, pullRequestId: number) =>
    `${repoUrls.ui.pullRequests(owner, slug)}/update/${pullRequestId}`,
};
