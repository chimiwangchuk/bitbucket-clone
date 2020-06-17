import { AvatarPropTypes } from '@atlaskit/avatar';
import Button from '@atlaskit/button';
import React, { PureComponent, ReactNode, ComponentType } from 'react';
import { FormattedMessage } from 'react-intl';
import PageableTable, {
  TableHeader,
  TableHeaderMobileHidden,
  TableHeaderMobileOnly,
} from '@atlassian/bitbucket-pageable-table';
import { Commit as CommitType, RenderedContent } from 'src/components/types';

import messages from '../i18n';
import * as styles from '../styles';

import ShowAllCommits from './show-all-commits';
import Commit, { CommitAuthor } from './commit';

export type CommitListProps = {
  commits: CommitType[];
  handleCommitChange: (
    selectedCommitRangeStart: string,
    selectedCommitRangeEnd: string
  ) => void;
  hasMore: boolean;
  isLoading: boolean;
  linkTarget?: AvatarPropTypes['target'];
  mergeBaseHash: string;
  onShowMoreClick: () => void;
  renderAfterMessage?: (commit: CommitType) => ReactNode;
  renderAuthorAvatar?: (
    author: CommitAuthor,
    avatarProps: Partial<AvatarPropTypes>
  ) => ReactNode;
  renderAuthorName?: (author: CommitAuthor) => JSX.Element | string;
  renderCommitMessage?: (renderedContent: RenderedContent) => ReactNode;
  selectedCommitRangeEnd: string;
  selectedCommitRangeStart: string;
  showCommitSelector: boolean;
  showComments: boolean;
  showHeaders: boolean;

  focusedRowIndex?: number | null;
  linkComponent?: ComponentType<{ href?: string; to?: string }>;
  renderBuildStatus?: (commit: CommitType) => React.ReactNode;
  renderPagination?: (() => JSX.Element) | null;
  shouldShowLoadingCover?: boolean;
};

export default class CommitList extends PureComponent<CommitListProps> {
  static defaultProps = {
    commits: [],
    handleCommitChange: () => {},
    hasMore: false,
    isLoading: false,
    mergeBaseHash: '',
    onShowMoreClick: () => {},
    renderPagination: null,
    selectedCommitRangeEnd: '',
    selectedCommitRangeStart: '',
    showCommitSelector: false,
    showComments: false,
    showHeaders: false,
    shouldShowLoadingCover: true,
  };

  hasBuilds() {
    const { commits } = this.props;
    // @ts-ignore TODO: fix noImplicitAny error here
    const predicate = commit => !!commit.extra && !!commit.extra.builds;

    return commits.some(predicate);
  }

  hasComments() {
    const { commits } = this.props;
    // @ts-ignore TODO: fix noImplicitAny error here
    const predicate = commit => !!commit.extra && !!commit.extra.commentcount;

    return commits.some(predicate);
  }

  renderColumnDefinitions = () => {
    const { showCommitSelector, showComments } = this.props;
    const hasBuilds = this.hasBuilds();
    const hasComments = this.hasComments();

    return (
      <colgroup>
        {showCommitSelector ? <styles.CommitSelectorColumnDefinition /> : null}
        <styles.AuthorColumnDefinition />
        <styles.CommitHashColumnDefinition />
        <col />
        {showComments && hasComments ? (
          <styles.CommentsColumnDefinition />
        ) : null}
        <styles.DateColumnDefinition />
        {hasBuilds ? <styles.BuildsColumnDefinition /> : null}
      </colgroup>
    );
  };

  renderColumnHeaders = () => {
    const { showCommitSelector, showComments } = this.props;
    const hasBuilds = this.hasBuilds();
    const hasComments = this.hasComments();

    return (
      <tr>
        {showCommitSelector ? <TableHeader /> : null}
        <TableHeaderMobileHidden>
          <FormattedMessage {...messages.authorHeader} />
        </TableHeaderMobileHidden>
        <TableHeaderMobileHidden>
          <FormattedMessage {...messages.hashHeader} />
        </TableHeaderMobileHidden>
        <TableHeaderMobileOnly>
          <FormattedMessage {...messages.summaryHeader} />
        </TableHeaderMobileOnly>
        <TableHeaderMobileHidden>
          <styles.CommitMessageHeaderWrapper>
            <FormattedMessage {...messages.messageHeader} />
          </styles.CommitMessageHeaderWrapper>
        </TableHeaderMobileHidden>
        {showComments && hasComments ? <TableHeaderMobileHidden /> : null}
        <TableHeaderMobileHidden>
          <FormattedMessage {...messages.dateHeader} />
        </TableHeaderMobileHidden>
        {hasBuilds ? (
          <styles.BuildsTableHeader>
            <FormattedMessage {...messages.buildsHeader} />
          </styles.BuildsTableHeader>
        ) : null}
      </tr>
    );
  };

  renderCommitSelector = () => {
    const {
      commits,
      handleCommitChange,
      mergeBaseHash,
      selectedCommitRangeStart,
      selectedCommitRangeEnd,
    } = this.props;
    const hasBuilds = this.hasBuilds();

    return (
      <ShowAllCommits
        handleCommitChange={handleCommitChange}
        hasBuilds={hasBuilds}
        selectedCommitRangeStart={selectedCommitRangeStart}
        selectedCommitRangeEnd={selectedCommitRangeEnd}
        mostRecentCommitHash={commits[0].hash}
        mergeBaseHash={mergeBaseHash}
      />
    );
  };

  // Since PageableTable is a Pure Component we have to pass new
  // instance of the render prop each render in order to force the
  // component to re-render each time CommitList re-renders
  createRenderCommit = () => (commit: CommitType, index: number) => {
    const {
      commits,
      isLoading,
      linkTarget,
      renderAfterMessage,
      showCommitSelector,
      showComments,
      handleCommitChange,
      renderAuthorAvatar,
      renderAuthorName,
      renderCommitMessage,
      focusedRowIndex,
      linkComponent,
      renderBuildStatus,
    } = this.props;
    const hasComments = this.hasComments();
    const commitsLength = commits.length;

    let parentCommitHash;
    const parents = commit.parents || [];
    // If it is the first commit, then unset the parent commit hash
    // and let the back-end figure out what the correct parent commit
    // or merge-base hash is.
    if (commitsLength === index + 1) {
      parentCommitHash = '';
    } else {
      // Only supports 'simple' commits with a single parent and
      // if it's a merge commit we only take the first parent commit
      parentCommitHash = parents.length
        ? parents[0].hash
        : commits[index + 1].hash;
    }

    return (
      <Commit
        key={commit.hash}
        isDisabled={isLoading}
        isFocused={index === focusedRowIndex}
        linkComponent={linkComponent}
        commit={commit}
        linkTarget={linkTarget}
        showCommitSelector={showCommitSelector}
        showCommitComments={showComments && hasComments}
        parentCommitHash={parentCommitHash}
        handleCommitChange={handleCommitChange}
        renderAfterMessage={renderAfterMessage}
        renderAuthorAvatar={renderAuthorAvatar}
        renderAuthorName={renderAuthorName}
        renderCommitMessage={renderCommitMessage}
        selectedCommitRangeStart={this.props.selectedCommitRangeStart}
        selectedCommitRangeEnd={this.props.selectedCommitRangeEnd}
        renderBuildStatus={renderBuildStatus}
        index={index}
      />
    );
  };

  render() {
    const {
      commits,
      hasMore,
      isLoading,
      onShowMoreClick,
      renderPagination,
      shouldShowLoadingCover,
      showCommitSelector,
      showHeaders,
    } = this.props;

    const commitsLength = commits.length;
    const renderHeaders = showHeaders ? this.renderColumnHeaders : null;
    const renderBeforeRows =
      showCommitSelector && commitsLength > 0
        ? this.renderCommitSelector
        : null;

    return (
      <styles.CommitsContainer isDisabled={isLoading}>
        <styles.CommitsWrapper>
          {commitsLength === 0 && !isLoading && (
            <FormattedMessage {...messages.noCommits} />
          )}
          <PageableTable
            isLoading={isLoading}
            renderColumnDefinitions={this.renderColumnDefinitions}
            renderHeaders={renderHeaders}
            renderBeforeRows={renderBeforeRows}
            renderPagination={renderPagination}
            rows={commits}
            shouldShowLoadingCover={shouldShowLoadingCover}
          >
            {this.createRenderCommit()}
          </PageableTable>
          {hasMore && !isLoading && (
            <styles.ShowMoreBtnContainer>
              <Button
                appearance="link"
                onClick={onShowMoreClick}
                shouldFitContainer
              >
                <FormattedMessage {...messages.showMoreCommits} />
              </Button>
            </styles.ShowMoreBtnContainer>
          )}
        </styles.CommitsWrapper>
      </styles.CommitsContainer>
    );
  }
}
