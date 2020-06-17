import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import React, { PureComponent, ReactNode } from 'react';
import { Repository } from 'src/components/types';
import {
  getRepoOwnerName,
  getRepoOwnerUrl,
} from 'src/sections/repository/utils/repository-owner';

import globalUrls from 'src/urls';
import * as styles from './breadcrumbs.style';

type RepositoryBreadcrumbsProps = {
  children?: ReactNode;
  isRoot: boolean;
  repository: Repository | null | undefined;
};

export default class RepositoryBreadcrumbs extends PureComponent<
  RepositoryBreadcrumbsProps
> {
  static defaultProps = {
    isRoot: false,
  };

  projectUrl() {
    const { repository } = this.props;

    if (!repository) {
      return undefined;
    }

    const { owner, project } = repository;

    if (!project) {
      return undefined;
    }

    if (project.links) {
      return project.links.html.href;
    }

    return owner ? globalUrls.ui.project(owner.uuid, project.key) : undefined;
  }

  render() {
    const { isRoot, repository } = this.props;

    if (!repository) {
      return null;
    }
    const { project, slug } = repository;

    return (
      <Breadcrumbs>
        <BreadcrumbsItem
          href={getRepoOwnerUrl(repository)}
          text={getRepoOwnerName(repository) || ''}
        />
        {project && (
          <BreadcrumbsItem href={this.projectUrl()} text={project.name} />
        )}
        {slug && !isRoot && (
          <BreadcrumbsItem
            component={() => (
              <styles.BreadcrumbsItemRepositoryLink repository={repository} />
            )}
            href={repository.links.html.href}
            text={slug}
          />
        )}
        {this.props.children}
      </Breadcrumbs>
    );
  }
}
