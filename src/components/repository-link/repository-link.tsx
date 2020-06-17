import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import { Repository, Link } from 'src/components/types';
import { BucketState } from 'src/types/state';
import urls from 'src/sections/repository/urls';
import { ApdexTask } from 'src/types/apdex';
import ApdexMeasuredLink from 'src/components/apdex-measured-link';

type LandingPage = {
  task: ApdexTask;
  getHref: (owner: string, slug: string) => string;
  feature?: string;
};

const LANDING_PAGES: { [K: string]: LandingPage } = {
  source: {
    task: ApdexTask.Source,
    getHref: (owner: string, slug: string) => `/${owner}/${slug}/`,
    feature: 'new-source-browser',
  },
  commits: {
    task: ApdexTask.Commits,
    getHref: (owner: string, slug: string) =>
      urls.ui.commits(`${owner}/${slug}`),
    feature: 'spa-commit-list',
  },
  branches: {
    task: ApdexTask.Branches,
    getHref: urls.ui.branches,
  },
  pull_requests: {
    task: ApdexTask.PullRequests,
    getHref: urls.ui.pullRequests,
  },
};

type StateProps = {
  getClientLandingPage: (
    repository: Repository | RepositoryLinkData
  ) => LandingPage | undefined;
};

export type RepositoryLinkData = {
  full_name: string;
  name: string;
  landing_page?: string;
  links: {
    html: Link;
  };
};

export type RepositoryLinkProps = {
  children?: ReactNode | null;
  // Allow styled-component style overrides
  className?: string;
  repository: Repository | RepositoryLinkData;
  onClick?: () => void;
  // @ts-ignore TODO: fix noImplicitAny error here
  innerRef?: (ReactNode) => void;
};

export class BaseRepositoryLink extends React.PureComponent<
  RepositoryLinkProps & StateProps
> {
  static defaultProps = {
    className: '',
  };

  render() {
    const {
      children,
      className,
      getClientLandingPage,
      innerRef,
      repository,
    } = this.props;
    const title = repository.name;
    const content = children || repository.name;
    const clientLandingPage = getClientLandingPage(repository);
    const [owner, slug] = repository.full_name.split('/');
    const { href } = repository.links.html;

    return clientLandingPage ? (
      <ApdexMeasuredLink
        {...this.props}
        to={clientLandingPage.getHref(owner, slug)}
        className={className}
        task={clientLandingPage.task}
        title={title}
      >
        {content}
      </ApdexMeasuredLink>
    ) : (
      <a href={href} className={className} ref={innerRef} title={title}>
        {content}
      </a>
    );
  }
}

export default connect<StateProps, RepositoryLinkProps>(
  (state: BucketState): StateProps => ({
    getClientLandingPage: (repository: Repository | RepositoryLinkData) => {
      const { landing_page: landingPage } = repository;

      // If the landing page is null, source (or overview), or not in the map, redirect
      // to the source view. Otherwise, check the landing pages map and redirect to the
      // appropiate page.
      const page =
        landingPage && landingPage in LANDING_PAGES
          ? LANDING_PAGES[landingPage]
          : LANDING_PAGES.source;

      if (!page.feature || state.global.features[page.feature]) {
        return page;
      }

      return undefined;
    },
  })
)(BaseRepositoryLink);
