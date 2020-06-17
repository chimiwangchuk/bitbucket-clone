import Fact from '@atlassian/bitkit-analytics';

type CloneGuidanceFactProps = {
  frontbucket_view?: boolean;
};

type CloneGuidanceRepositoryFactProps = {
  repo_uuid: string;
  frontbucket_view?: boolean;
};

export class CloneGuidanceCloneWithSourcetreeFact extends Fact<
  CloneGuidanceRepositoryFactProps
> {
  constructor(data: CloneGuidanceRepositoryFactProps | null | undefined) {
    super(data);
    // @ts-ignore
    this.data = { ...this.data, frontbucket_view: true };
  }
  name =
    'bitbucket.repository.overview.initialState.guidanceMessage.cloneSourcetree.click';
}

export class CloneGuidanceDownloadSourcetreeFact extends Fact<
  CloneGuidanceRepositoryFactProps
> {
  constructor(data: CloneGuidanceRepositoryFactProps | null | undefined) {
    super(data);
    // @ts-ignore
    this.data = { ...this.data, frontbucket_view: true };
  }
  name =
    'bitbucket.repository.overview.initialState.guidanceMessage.downloadSourcetree.click';
}

export class CloneGuidanceLearnMoreFact extends Fact<
  CloneGuidanceRepositoryFactProps
> {
  constructor(data: CloneGuidanceRepositoryFactProps | null | undefined) {
    super(data);
    // @ts-ignore
    this.data = { ...this.data, frontbucket_view: true };
  }
  name =
    'bitbucket.repository.overview.initialState.guidanceMessage.learnMore.click';
}

export class CloneGuidanceMessageDismissedFact extends Fact<
  CloneGuidanceFactProps
> {
  constructor(data: CloneGuidanceFactProps | null | undefined) {
    super(data);
    this.data = { ...this.data, frontbucket_view: true };
  }
  name = 'bitbucket.repository.overview.initialState.guidanceMessage.dismissed';
}

export class CloneGuidanceMessageShownFact extends Fact<
  CloneGuidanceFactProps
> {
  constructor(data: CloneGuidanceFactProps | null | undefined) {
    super(data);
    this.data = { ...this.data, frontbucket_view: true };
  }
  name = 'bitbucket.repository.overview.initialState.guidanceMessage.shown';
}

type SourceFileActionClickedFactProps = {
  label: string;
  repository_uuid: string;
  frontbucket_view: boolean;
};

type SourceHeaderActionClickedFactProps = {
  label: string;
  repository_uuid?: string;
  frontbucket_view: boolean;
};

type SourceRepoDetailsActionClickedProps = {
  label: string;
  repository_uuid: string;
  frontbucket_view: boolean;
};

export class SourceFileActionClickedFact extends Fact<
  SourceFileActionClickedFactProps
> {
  name = 'bitbucket.repository.source_browser.file.click';
}

export class SourceHeaderActionClickedFact extends Fact<
  SourceHeaderActionClickedFactProps
> {
  name = 'bitbucket.repository.source_browser.header.click';
}

export class SourceRepoDetailsActionClicked extends Fact<
  SourceRepoDetailsActionClickedProps
> {
  name = 'bitbucket.repository.source_browser.repo_details.click';
}

type RepoCloneClientClickedProps = {
  client: 'Sourcetree' | 'Xcode';
  description?: string;
};

export class RepoCloneClientClicked extends Fact<RepoCloneClientClickedProps> {
  name = 'bitbucket.repository.clone_client.click';
}
