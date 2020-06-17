import { QuickSearch } from '@atlaskit/quick-search';
import debounce from 'lodash-es/debounce';
import qs from 'qs';
import React, { ComponentType, PureComponent, ChangeEvent } from 'react';
import { injectIntl, FormattedMessage, InjectedIntl } from 'react-intl';
import { FactContext, uncurlyUuid } from '@atlassian/bitkit-analytics';
import {
  RepositoryGlobalSearchResult,
  PullRequestGlobalSearchResult,
  AnalyticsEvent,
} from '../types';
import {
  ViewCodeSearchResultsFact,
  ViewCodeSearchResultsFactProps,
  SearchDrawerItemClickFact,
} from './facts';
import messages from './search.i18n';
import * as styles from './search.style';

import IssueResult from './result-types/issue-result';
import RepositoryResult from './result-types/repository-result';
import PullRequestResult from './result-types/pull-request-result';
import ViewAllResults from './result-types/view-all-results';
import DrawerItemGroup from './drawer-item-group';
import { ReposContext } from './contexts';

const urls = {
  repositories: (search?: string) =>
    `/dashboard/repositories${search ? `?${qs.stringify({ search })}` : ''}`,
  searchResults: () => '/search',
};

export type SearchTargetUserProps = {
  targetUserUuid?: string;
  targetUserDisplayName?: string;
};

export type BaseGlobalSearchProps = SearchTargetUserProps & {
  currentProject?: BB.Project;
  repoSlug?: string;
  repoName?: string;
  isLoading: boolean;
  linkComponent?: ComponentType<any>;
  onSearch?: (event: ChangeEvent) => void;
  onSearchDrawerInit?: () => void;
  onSearchSubmit?: () => void;
  recentlyViewed?: BB.Repository[];
  searchQuery?: string;
  searchResults?: {
    issues: BB.Issue[];
    pullRequests: PullRequestGlobalSearchResult[];
    repositories: RepositoryGlobalSearchResult[];
  };
  repositoryLinkComponent?: ComponentType<any>;
  pullRequestLinkComponent?: ComponentType<any>;
  isLoggedIn: boolean;
  publishUiEvent: (event: AnalyticsEvent) => void;
};

type GlobalSearchProps = BaseGlobalSearchProps & {
  onSearchDrawerClose: () => void;
  isSearchDrawerOpen: boolean;
};

type InjectedProps = { intl: InjectedIntl };

type SearchQueryParams = {
  q?: string;
  account?: string;
};

const defaultProps = {
  isLoading: false,
  onSearch: () => {},
  onSearchDrawerInit: () => {},
  onSearchSubmit: () => {},
  recentlyViewed: [],
  searchQuery: '',
  searchResults: {
    issues: [],
    pullRequests: [],
    repositories: [],
  },
};

type DefaultProps = typeof defaultProps;

class GlobalSearch extends PureComponent<
  GlobalSearchProps & DefaultProps & InjectedProps
> {
  static getViewName() {
    const meta = document.querySelector('meta[name=bb-view-name]');
    if (
      meta &&
      meta instanceof HTMLMetaElement &&
      typeof meta.content === 'string'
    ) {
      return meta.content;
    }
    return '';
  }

  static defaultProps: DefaultProps = defaultProps;

  componentDidMount() {
    if (typeof this.props.onSearchDrawerInit === 'function') {
      this.props.onSearchDrawerInit();
    }
  }

  getUserUUID = () => {
    const account = this.props.targetUserUuid;
    if (account) {
      return uncurlyUuid(account);
    }
    return undefined;
  };

  publishAnalyticEvent(actionSubjectId: string, analyticsAttrs: object) {
    this.props.publishUiEvent({
      action: 'clicked',
      actionSubject: 'link',
      actionSubjectId,
      source: 'navigation',
      attributes: {
        ...analyticsAttrs,
      },
    });
  }

  getSearchContext() {
    const {
      currentProject,
      repoSlug,
      repoName,
      targetUserDisplayName,
    } = this.props;

    if (repoSlug) {
      return {
        modifier: `repo:${repoSlug}`,
        name: repoName,
      };
    } else if (currentProject && currentProject.key) {
      return {
        modifier: `project:${currentProject.key}`,
        name: currentProject.name,
      };
    } else if (targetUserDisplayName) {
      return {
        name: targetUserDisplayName,
      };
    }
    return {};
  }

  getQuery() {
    const { searchQuery } = this.props;
    const context = this.getSearchContext();
    const parts: string[] = [];
    if (context.modifier) {
      parts.push(context.modifier);
    }
    if (searchQuery) {
      parts.push(searchQuery);
    }
    return parts.join(' ');
  }

  getSearchUrl = () => {
    const url = urls.searchResults();
    const q = this.getQuery();
    const account = this.props.targetUserUuid;

    if (!q) {
      return url;
    }

    const params: SearchQueryParams = { q };
    if (account) {
      params.account = account;
    }

    return `${url}?${qs.stringify(params)}`;
  };

  renderCodeSearch() {
    const { intl, searchQuery } = this.props;

    const analyticsAttrs: ViewCodeSearchResultsFactProps = {
      context: GlobalSearch.getViewName(),
    };
    const userUuid = this.getUserUUID();
    if (userUuid) {
      analyticsAttrs.user_uuid = userUuid;
    }

    const context = this.getSearchContext();

    const text = context.name ? (
      <FormattedMessage
        {...(searchQuery
          ? messages.viewAllCodeMatchesIn
          : messages.searchForCodeIn)}
        values={{
          name: <styles.SearchContext>{context.name}</styles.SearchContext>,
        }}
      />
    ) : (
      <FormattedMessage
        {...(searchQuery
          ? messages.viewAllCodeMatches
          : messages.searchForCode)}
      />
    );

    return (
      <DrawerItemGroup
        key="code"
        title={intl.formatMessage(messages.codeHeading)}
      >
        <FactContext.Consumer key="view-code">
          {({ publishFact }) => (
            <ViewAllResults
              // @ts-ignore We don't have @atlaskit/navigation typedefs to Pick props that we spread through
              onClick={() => {
                publishFact(new ViewCodeSearchResultsFact(analyticsAttrs));
                this.publishAnalyticEvent('viewCodeLink', analyticsAttrs);
              }}
              resultId="view-code"
              href={this.getSearchUrl()}
              linkComponent={this.props.linkComponent}
              text={text}
            />
          )}
        </FactContext.Consumer>
      </DrawerItemGroup>
    );
  }

  renderRecentRepos() {
    const { intl, isLoggedIn } = this.props;
    return (
      isLoggedIn && (
        <ReposContext.Consumer>
          {recentlyViewed =>
            !!recentlyViewed && (
              <DrawerItemGroup
                title={intl.formatMessage(messages.recentlyViewedHeading)}
                key="recent-repositories"
              >
                {recentlyViewed.map((repository: BB.Repository, index) => {
                  const url = repository.links.html.href;

                  return (
                    <FactContext.Consumer key={url}>
                      {({ publishFact }) => (
                        <RepositoryResult
                          avatarUrl={repository.links.avatar.href}
                          fullSlug={repository.full_name}
                          name={repository.name}
                          repository={repository}
                          repositoryLinkComponent={
                            this.props.repositoryLinkComponent
                          }
                          onSearchDrawerClose={this.props.onSearchDrawerClose}
                          isSearchDrawerOpen={this.props.isSearchDrawerOpen}
                          // @ts-ignore We don't have @atlaskit/quick-search typedefs to Pick props that we spread through
                          onClick={() => {
                            publishFact(
                              new SearchDrawerItemClickFact({
                                total_shown: recentlyViewed.length,
                                index,
                                type: 'recent_repos',
                                repository_uuid: uncurlyUuid(repository.uuid),
                                owner_uuid: uncurlyUuid(
                                  repository.owner
                                    ? repository.owner.uuid
                                    : '{}'
                                ),
                              })
                            );
                            this.publishAnalyticEvent('repositoryLink', {
                              total_shown: recentlyViewed.length,
                              index,
                              type: 'recent_repos',
                              repository_uuid: uncurlyUuid(repository.uuid),
                              owner_uuid: uncurlyUuid(
                                repository.owner ? repository.owner.uuid : '{}'
                              ),
                            });
                          }}
                          url={url}
                        />
                      )}
                    </FactContext.Consumer>
                  );
                })}
              </DrawerItemGroup>
            )
          }
        </ReposContext.Consumer>
      )
    );
  }

  // @ts-ignore TODO: fix noImplicitAny error here
  renderRepositoryResults(repositories) {
    const { intl, searchQuery } = this.props;

    // @ts-ignore TODO: fix noImplicitAny error here
    const results = repositories.map((repository, index) => (
      <FactContext.Consumer key={repository.url}>
        {({ publishFact }) => (
          <RepositoryResult
            avatarUrl={repository.logo}
            fullSlug={repository.fullSlug}
            name={repository.name}
            repository={repository}
            repositoryLinkComponent={this.props.repositoryLinkComponent}
            onSearchDrawerClose={this.props.onSearchDrawerClose}
            isSearchDrawerOpen={this.props.isSearchDrawerOpen}
            // @ts-ignore We don't have @atlaskit/quick-search typedefs to Pick props that we spread through
            onClick={() => {
              publishFact(
                new SearchDrawerItemClickFact({
                  total_shown: repositories.length,
                  index,
                  type: 'search_repos',
                  repository_uuid: uncurlyUuid(repository.uuid),
                  owner_uuid: uncurlyUuid(repository.owner_uuid),
                })
              );
              this.publishAnalyticEvent('repositoryLink', {
                total_shown: repositories.length,
                index,
                type: 'search_repos',
                repository_uuid: uncurlyUuid(repository.uuid),
                owner_uuid: uncurlyUuid(repository.owner_uuid),
              });
            }}
            url={repository.url}
          />
        )}
      </FactContext.Consumer>
    ));

    const hasRepoResults = repositories.length !== 0;
    const viewMoreLink = hasRepoResults
      ? urls.repositories(searchQuery)
      : urls.repositories();
    const text = intl.formatMessage(
      hasRepoResults
        ? messages.viewAllRepositoyMatches
        : messages.viewAllRepositories
    );
    results.push(
      <ViewAllResults
        // @ts-ignore We don't have @atlaskit/navigation typedefs to Pick props that we spread through
        resultId="view-more-repo-results"
        key="view-more-repo-results"
        href={viewMoreLink}
        text={text}
      />
    );

    return (
      <DrawerItemGroup
        key="repositories"
        title={intl.formatMessage(messages.repositoriesHeading)}
      >
        {results}
      </DrawerItemGroup>
    );
  }

  // @ts-ignore TODO: fix noImplicitAny error here
  renderPullRequestResults(pullRequests) {
    const { intl } = this.props;
    return (
      <DrawerItemGroup
        key="pull-requests"
        title={intl.formatMessage(messages.pullRequestsHeading)}
      >
        {pullRequests.map((pr: any, index: any) => (
          <FactContext.Consumer key={pr.url}>
            {({ publishFact }) => (
              <PullRequestResult
                // @ts-ignore We don't have @atlaskit/quick-search typedefs to Pick props that we spread through
                onClick={() => {
                  publishFact(
                    new SearchDrawerItemClickFact({
                      total_shown: pullRequests.length,
                      index,
                      type: 'search_prs',
                      repository_uuid: uncurlyUuid(pr.repo_uuid),
                      owner_uuid: uncurlyUuid(pr.repo_owner_uuid),
                      pull_request_id: pr.localId,
                    })
                  );
                  this.publishAnalyticEvent('pullRequestLink', {
                    total_shown: pullRequests.length,
                    index,
                    type: 'search_prs',
                    repository_uuid: uncurlyUuid(pr.repo_uuid),
                    owner_uuid: uncurlyUuid(pr.repo_owner_uuid),
                    pull_request_id: pr.localId,
                  });
                }}
                pullRequest={pr}
                pullRequestLinkComponent={this.props.pullRequestLinkComponent}
                onSearchDrawerClose={this.props.onSearchDrawerClose}
                isSearchDrawerOpen={this.props.isSearchDrawerOpen}
              />
            )}
          </FactContext.Consumer>
        ))}
      </DrawerItemGroup>
    );
  }

  // @ts-ignore TODO: fix noImplicitAny error here
  renderIssueResults(issues) {
    const { intl } = this.props;

    return (
      <DrawerItemGroup
        key="issues"
        title={intl.formatMessage(messages.issuesHeading)}
      >
        {issues.map((i: any, index: number) => (
          <FactContext.Consumer key={i.url}>
            {({ publishFact }) => (
              <IssueResult
                // @ts-ignore We don't have @atlaskit/quick-search typedefs to Pick props that we spread through
                onClick={() => {
                  publishFact(
                    new SearchDrawerItemClickFact({
                      total_shown: issues.length,
                      index,
                      type: 'search_issues',
                      repository_uuid: uncurlyUuid(i.repo_uuid),
                      owner_uuid: uncurlyUuid(i.repo_owner_uuid),
                      issue_id: i.localId,
                    })
                  );
                  this.publishAnalyticEvent('issueLink', {
                    total_shown: issues.length,
                    index,
                    type: 'search_issues',
                    repository_uuid: uncurlyUuid(i.repo_uuid),
                    owner_uuid: uncurlyUuid(i.repo_owner_uuid),
                    issue_id: i.localId,
                  });
                }}
                issue={{
                  id: i.localId,
                  repository: i.repo,
                  title: i.title,
                }}
                href={i.url}
                resultId={i.url}
              />
            )}
          </FactContext.Consumer>
        ))}
      </DrawerItemGroup>
    );
  }

  renderSearchResults() {
    const { searchResults } = this.props;

    // Repositories always renders
    const resultGroups = [
      this.renderRepositoryResults(searchResults.repositories),
    ];

    if (searchResults.pullRequests.length !== 0) {
      resultGroups.push(
        this.renderPullRequestResults(searchResults.pullRequests)
      );
    }

    if (searchResults.issues.length !== 0) {
      resultGroups.push(this.renderIssueResults(searchResults.issues));
    }
    return resultGroups;
  }

  render() {
    const {
      intl,
      isLoading,
      onSearch,
      onSearchSubmit,
      searchQuery,
      isLoggedIn,
    } = this.props;

    const resultGroups = [this.renderCodeSearch()];

    if (searchQuery.trim() && !isLoading && isLoggedIn) {
      this.renderSearchResults().forEach(group => resultGroups.push(group));
    } else {
      const recentRepos = this.renderRecentRepos();
      if (recentRepos) {
        resultGroups.push(recentRepos);
      }
    }

    const debounceSearch = debounce(onSearch, 400);

    // @ts-ignore TODO: fix noImplicitAny error here
    const onSearchInput = e => {
      // needed because we're debouncing
      e.persist();

      debounceSearch(e);
    };

    return (
      <styles.StyledSearchContainer>
        <QuickSearch
          isLoading={isLoading && !!searchQuery.trim()}
          placeholder={intl.formatMessage(messages.searchPlaceholder)}
          value={searchQuery}
          onSearchInput={onSearchInput}
          onSearchSubmit={onSearchSubmit}
        >
          {resultGroups}
        </QuickSearch>
      </styles.StyledSearchContainer>
    );
  }
}

export default injectIntl(GlobalSearch) as React.ComponentClass<
  GlobalSearchProps
>;
