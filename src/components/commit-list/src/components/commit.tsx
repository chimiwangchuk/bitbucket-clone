import React, { PureComponent, ReactNode, ComponentType } from 'react';
import { InjectedIntl, injectIntl, FormattedMessage } from 'react-intl';
import { AvatarPropTypes } from '@atlaskit/avatar';
import CommentIcon from '@atlaskit/icon/glyph/comment';
import Lozenge from '@atlaskit/lozenge';
import Tooltip from '@atlaskit/tooltip';

import RenderedTitle from '@atlassian/bitbucket-rendered-title';
import {
  UnmatchedCommitAuthorAvatar,
  UnmatchedCommitAuthorName,
  UserAvatar,
  UserName,
} from '@atlassian/bitbucket-user-profile';
import { BuildStatus } from '@atlassian/bitkit-builds';
import {
  TableCell,
  TableCellMobileHidden,
} from '@atlassian/bitbucket-pageable-table';
import {
  Commit as CommitType,
  RenderedContent,
  User,
} from 'src/components/types';
import { RelativeDate } from '@atlassian/bitkit-date';

import messages from '../i18n';
import * as styles from '../styles';
import { shortHash } from '../utils/string-helpers';

export type CommitAuthor = {
  raw: string;
  type: 'author';
  user?: User;
};

export const replaceRegexp = /\n|\r|\t/g;

type CommitWithoutDefaultProps = {
  isDisabled?: boolean;
  commit: CommitType;
  linkTarget?: AvatarPropTypes['target'];
  parentCommitHash: string;
  handleCommitChange?: (
    selectedCommitRangeStart: string,
    selectedCommitRangeEnd: string
  ) => void;
  renderAfterMessage?: (commit: CommitType) => ReactNode;
  renderAuthorAvatar?: (
    author: CommitAuthor,
    avatarProps: Partial<AvatarPropTypes>
  ) => ReactNode;
  renderAuthorName?: (author: CommitAuthor) => JSX.Element | string;
  renderCommitMessage?: (renderedContent: RenderedContent) => ReactNode;
  selectedCommitRangeStart: string;
  selectedCommitRangeEnd: string;
  showCommitComments: boolean;
  showCommitSelector: boolean;
  isFocused?: boolean;
  linkComponent?: ComponentType<{
    href?: string;
    to?: string;
    // mimicking innerRef type def from react-router-dom
    innerRef?: (node: HTMLAnchorElement | null) => void;
  }>;
  intl: InjectedIntl;
  renderBuildStatus?: (commit: CommitType) => React.ReactNode;
  index: number;
};

type CommitDefaultProps = {
  handleCommitChange: (
    selectedCommitRangeStart: string,
    selectedCommitRangeEnd: string
  ) => void;
  renderAuthorAvatar: (
    author: CommitAuthor,
    avatarProps: Partial<AvatarPropTypes>
  ) => ReactNode;
  renderAuthorName: (author: CommitAuthor) => JSX.Element | string;
  renderAfterMessage: (commit: CommitType) => ReactNode;
};

type CommitProps = CommitWithoutDefaultProps & CommitDefaultProps;

class Commit extends PureComponent<CommitProps> {
  linkRef: HTMLElement | null;

  static defaultProps: CommitDefaultProps = {
    handleCommitChange: () => {},
    renderAfterMessage: () => null,
    renderAuthorAvatar: (
      author: CommitAuthor,
      avatarProps: AvatarPropTypes
    ) => {
      const { raw, user } = author;
      if (!user) {
        return (
          <UnmatchedCommitAuthorAvatar rawCommitAuthor={raw} {...avatarProps} />
        );
      }
      return <UserAvatar user={user} {...avatarProps} />;
    },
    renderAuthorName: (author: CommitAuthor) => {
      return author.user ? (
        <UserName user={author.user} />
      ) : (
        <UnmatchedCommitAuthorName rawCommitAuthor={author.raw} />
      );
    },
  };

  componentDidUpdate(prevProps: CommitProps) {
    if (!this.linkRef) {
      return;
    }

    if (!prevProps.isFocused && this.props.isFocused) {
      this.linkRef.focus();
      return;
    }

    if (prevProps.isFocused && !this.props.isFocused) {
      this.linkRef.blur();
    }
  }

  isMergeCommit() {
    const { commit } = this.props;

    return commit.parents && commit.parents.length >= 2;
  }

  renderBuilds() {
    const { commit, renderBuildStatus } = this.props;
    const { extra } = commit;

    if (extra && extra.builds) {
      return (
        <TableCell>
          <styles.BuildStatusWrapper>
            {renderBuildStatus ? (
              renderBuildStatus(commit)
            ) : (
              <BuildStatus builds={extra.builds} />
            )}
          </styles.BuildStatusWrapper>
        </TableCell>
      );
    }

    return null;
  }

  renderCommitHash(enableFocus = false) {
    const {
      showCommitSelector,
      commit,
      linkComponent: Link,
      linkTarget: target,
    } = this.props;
    const hash = (
      <styles.CommitHash key={commit.hash}>
        {shortHash(commit.hash)}
      </styles.CommitHash>
    );

    if (showCommitSelector) {
      return hash;
    }

    if (Link) {
      return (
        <Link
          key={commit.hash}
          href={commit.links.html.href}
          to={commit.links.html.href}
          innerRef={ref => {
            if (enableFocus) {
              this.linkRef = ref;
            }
          }}
          {...(target ? { target } : {})}
        >
          {hash}
        </Link>
      );
    }

    return (
      <a
        key={commit.hash}
        href={commit.links.html.href}
        ref={ref => {
          if (enableFocus) {
            this.linkRef = ref;
          }
        }}
        {...(target ? { target } : {})}
      >
        {hash}
      </a>
    );
  }

  isSelected = (commitRangeStart: string, commitRangeEnd: string) => {
    const { selectedCommitRangeStart, selectedCommitRangeEnd } = this.props;

    return (
      commitRangeStart === selectedCommitRangeStart &&
      commitRangeEnd === selectedCommitRangeEnd
    );
  };

  renderCommitLabel() {
    const { intl } = this.props;

    if (this.isMergeCommit()) {
      return (
        <Tooltip
          content={intl.formatMessage(messages.mergeCommitTooltip)}
          position="top"
        >
          <styles.CommitLabel>
            <Lozenge>M</Lozenge>
          </styles.CommitLabel>
        </Tooltip>
      );
    }

    return null;
  }

  renderCommitMessage() {
    const {
      commit,
      renderAfterMessage,
      renderAuthorName,
      renderCommitMessage,
    } = this.props;
    const authorName = renderAuthorName(commit.author);

    const renderedMessage =
      (commit.rendered && commit.rendered.message) || commit.summary;

    return (
      <styles.MessageContainer>
        {renderedMessage ? (
          renderCommitMessage ? (
            <styles.CommitMessage title={renderedMessage.raw}>
              {renderCommitMessage(renderedMessage)}
            </styles.CommitMessage>
          ) : (
            <styles.CommitMessage title={renderedMessage.raw}>
              <RenderedTitle
                fadeLinesAfterFirst
                renderedContent={renderedMessage}
              />
            </styles.CommitMessage>
          )
        ) : (
          <styles.CommitMessage title={commit.message}>
            {commit.message.replace(replaceRegexp, ' ')}
          </styles.CommitMessage>
        )}
        <styles.SummaryInfo>
          <styles.Byline>
            <FormattedMessage
              {...messages.summaryInfo}
              values={{
                author: authorName,
                date: (
                  <RelativeDate
                    key={`${commit.date}-${commit.hash}`}
                    date={commit.date}
                  />
                ),
                id: this.renderCommitHash(),
              }}
            />
          </styles.Byline>
        </styles.SummaryInfo>
        <styles.CommitInfo>{renderAfterMessage(commit)}</styles.CommitInfo>
      </styles.MessageContainer>
    );
  }

  renderCommitComments() {
    const { commit, intl } = this.props;
    const hasComments = commit.extra && !!commit.extra.commentcount;

    return (
      <TableCellMobileHidden>
        {hasComments ? (
          <styles.FlexContainer>
            <styles.CommentIconWrapper>
              <CommentIcon
                size="medium"
                label={intl.formatMessage(messages.commentLabel)}
              />
            </styles.CommentIconWrapper>
            {commit.extra && commit.extra.commentcount}
          </styles.FlexContainer>
        ) : null}
      </TableCellMobileHidden>
    );
  }

  render() {
    const {
      commit,
      handleCommitChange,
      linkTarget: target,
      parentCommitHash,
      renderAuthorAvatar,
      renderAuthorName,
      showCommitComments,
      showCommitSelector,
      isDisabled,
      isFocused,
      index,
    } = this.props;

    const avatar = renderAuthorAvatar(commit.author, {
      size: 'small',
      target,
      isDisabled,
    });
    const authorName = renderAuthorName(commit.author);

    return (
      <styles.CommitSelectorOption
        tabIndex={showCommitSelector ? 0 : undefined}
        onClick={
          showCommitSelector
            ? () => {
                handleCommitChange(parentCommitHash, commit.hash);
              }
            : undefined
        }
        onKeyPress={e => {
          if (showCommitSelector && e.key === 'Enter') {
            handleCommitChange(parentCommitHash, commit.hash);
          }
        }}
        hasPointerCursor={showCommitSelector}
        isFocused={isFocused}
        isMergeCommit={this.isMergeCommit()}
      >
        {showCommitSelector ? (
          <TableCell>
            <input
              type="radio"
              value={commit.hash}
              aria-checked={this.isSelected(parentCommitHash, commit.hash)}
              checked={this.isSelected(parentCommitHash, commit.hash)}
            />
          </TableCell>
        ) : null}
        <TableCellMobileHidden>
          <styles.FlexContainer>
            {avatar} <styles.AuthorName>{authorName}</styles.AuthorName>
          </styles.FlexContainer>
        </TableCellMobileHidden>
        <TableCellMobileHidden>
          <styles.CommitHashWrapper data-qa={`commit-hash-wrapper-${index}`}>
            {this.renderCommitHash(true)}
            {this.renderCommitLabel()}
          </styles.CommitHashWrapper>
        </TableCellMobileHidden>
        <TableCell>{this.renderCommitMessage()}</TableCell>
        {showCommitComments ? this.renderCommitComments() : null}
        <TableCellMobileHidden>
          <RelativeDate date={commit.date} />
        </TableCellMobileHidden>
        {this.renderBuilds()}
      </styles.CommitSelectorOption>
    );
  }
}

export default injectIntl<CommitWithoutDefaultProps>(Commit);
