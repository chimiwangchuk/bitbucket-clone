import { Grid, GridColumn } from '@atlaskit/page';
import PageHeader from '@atlaskit/page-header';
import Button from '@atlaskit/button';
import React, { PureComponent, Fragment, ComponentType } from 'react';
// @ts-ignore TODO: fix noImplicitAny error here
import Helmet from 'react-helmet';
import qs from 'qs';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';
import { RouteContext } from '@atlaskit/router';

import { publishScreenEvent } from 'src/utils/analytics/publish';
import { RepositoryFilters } from 'src/sections/dashboard/types';
import urls from 'src/sections/repository/urls';

import { withApdexTransition } from 'src/components/apdex/with-apdex';
import { ApdexTask } from 'src/types/apdex';

import { commonMessages } from 'src/i18n';
import fetchRepositories from 'src/redux/dashboard/actions/fetch-repositories';
import { withRouter } from 'src/router/utils';
import RepositoryPagination from '../containers/repository-pagination';
import RepositoryTable from '../containers/repository-table';
import Filters from './filters';
import SortButton from './sort-button';

import messages from './index.i18n';
import * as styles from './index.style';

// Prefetch the main chunk of code-review since many users navigate there next
import(
  /* webpackChunkName: "code-review-prefetch", webpackPrefetch: true */ 'src/sections/repository/sections/pull-request/containers/page'
);

export const NUM_REPOS = 25;

export type DashboardRepositoriesPageProps = Pick<
  RouteComponentProps,
  'history' | 'staticContext'
> & {
  intl: InjectedIntl;
  fetchRepositories: typeof fetchRepositories;
  isAtlaskitRouterResourcesForDashboardEnabled: boolean;
} & RouteContext;

export class DashboardRepositoriesPage extends PureComponent<
  DashboardRepositoriesPageProps
> {
  componentDidMount() {
    publishScreenEvent('repositoryDashboardScreen');

    if (!this.props.isAtlaskitRouterResourcesForDashboardEnabled) {
      this.fetchRepositories();
    }
  }

  // @ts-ignore TODO: fix noImplicitAny error here
  componentDidUpdate(prevProps) {
    if (prevProps.location !== this.props.location) {
      this.fetchRepositories();
    }
  }

  fetchRepositories() {
    const { page, sort, ...filters } = this.parseQuery();
    this.props.fetchRepositories({
      pagelen: NUM_REPOS,
      page,
      filters,
      sort,
    });
  }

  parseQuery = () => {
    const query = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    });

    const { projectKey, projectOwner } = query;
    const project =
      !!projectKey && !!projectOwner
        ? { owner: projectOwner, key: projectKey }
        : null;

    return {
      page: parseInt(query.page, 10) || 1,
      search: query.search || null,
      isWatching: !!query.watching,
      sort: query.sort || null,
      project,
      owner: query.owner || null,
      workspace: query.workspace || null,
      scm: query.scm || null,
    };
  };

  buildUrl = ({
    page,
    filters,
    sort,
  }: {
    page: number;
    filters: RepositoryFilters;
    sort?: string;
  }) => {
    const { search: query, pathname } = this.props.location;
    const oldQuery = qs.parse(query, {
      ignoreQueryPrefix: true,
    });
    const { project, search, isWatching, owner, workspace, scm } = filters;

    const newState = {
      ...oldQuery,
      page: page > 1 ? page : null,
      search: search || null,
      watching: isWatching || null,
      sort: sort || null,
      projectKey: project ? project.key : null,
      projectOwner: project ? project.owner : null,
      scm: scm || null,
      owner: owner || null,
      workspace: workspace || null,
    };
    const newQuery = qs.stringify(newState, { skipNulls: true });

    return `${pathname}?${newQuery}`;
  };

  handleSortChange = () => {
    const { page, sort, ...filters } = this.parseQuery();
    if (!sort) {
      this.props.history.push(
        this.buildUrl({
          page: 0,
          filters,
          sort: 'updated_on',
        })
      );
    } else {
      this.props.history.push(
        this.buildUrl({
          page: 0,
          filters,
        })
      );
    }
  };

  handleFilterChange = (filters: RepositoryFilters) => {
    const { sort } = this.parseQuery();
    this.props.history.push(
      this.buildUrl({
        page: 0,
        filters,
        sort,
      })
    );
  };

  render() {
    const { intl } = this.props;
    const { page, sort, ...filters } = this.parseQuery();
    const getPaginationUrl = (selectedPage: number) =>
      this.buildUrl({
        page: selectedPage,
        filters,
        sort,
      });
    const filterApplied =
      filters.search ||
      filters.isWatching ||
      filters.owner ||
      filters.workspace ||
      filters.scm;

    const createRepoUrl = urls.ui.create();

    const action = (
      <div data-qa="create-repository-button">
        <Button href={createRepoUrl}>
          <FormattedMessage {...commonMessages.createRepositoryButton} />
        </Button>
      </div>
    );

    return (
      <Fragment>
        <Helmet defer={false} title={intl.formatMessage(messages.pageTitle)} />
        <Grid layout="fluid" spacing="comfortable">
          <GridColumn>
            <PageHeader actions={action}>
              <FormattedMessage {...messages.pageTitle} />
            </PageHeader>
            <styles.Section>
              <Filters
                filters={filters}
                onFilterChange={this.handleFilterChange}
              />
              <RepositoryTable
                filterApplied={filterApplied}
                renderControl={() => (
                  <styles.SortButton>
                    <SortButton
                      onClick={this.handleSortChange}
                      isAscending={!!sort}
                    />
                  </styles.SortButton>
                )}
                renderPagination={() => (
                  <styles.PaginationContainer>
                    <RepositoryPagination
                      page={page}
                      getPaginationUrl={getPaginationUrl}
                    />
                  </styles.PaginationContainer>
                )}
              />
            </styles.Section>
          </GridColumn>
        </Grid>
      </Fragment>
    );
  }
}

export default compose<ComponentType<DashboardRepositoriesPageProps>>(
  withRouter,
  withApdexTransition(ApdexTask.DashboardRepositories),
  injectIntl
)(DashboardRepositoriesPage);
