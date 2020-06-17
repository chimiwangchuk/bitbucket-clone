import { AvatarPropTypes } from '@atlaskit/avatar';
import React, { PureComponent } from 'react';
import {
  CommitList as BaseCommitList,
  CommitSelector as BaseCommitSelector,
} from 'src/components/commit-list';

import { CommitAuthor } from 'src/components/types';
import {
  UnmatchedCommitAuthorAvatar,
  UnmatchedCommitAuthorName,
} from 'src/components/user-profile';
import UserAvatar from 'src/containers/user-avatar';
import UserName from 'src/containers/user-name';

type CommitListProps = JSX.LibraryManagedAttributes<
  typeof BaseCommitList,
  BaseCommitList['props']
>;

type CommitSelectorProps = JSX.LibraryManagedAttributes<
  typeof BaseCommitSelector,
  BaseCommitSelector['props']
>;

const renderAuthorAvatar = (
  author: CommitAuthor,
  avatarProps: Partial<AvatarPropTypes>
) =>
  author.user ? (
    <UserAvatar
      {...avatarProps}
      profileCardPosition="bottom-start"
      user={author.user}
    />
  ) : (
    // Do not pass `rawCommitAuthor` in, because we already provide the raw author's name
    // in the same UI context (via `<UnmatchedCommitAuthorName />`)
    <UnmatchedCommitAuthorAvatar {...avatarProps} />
  );

const renderAuthorName = (author: CommitAuthor) =>
  author.user ? (
    <UserName
      key={author.user.account_id}
      profileCardPosition="bottom-start"
      user={author.user}
    />
  ) : (
    <UnmatchedCommitAuthorName key={author.raw} rawCommitAuthor={author.raw} />
  );

export class CommitList extends PureComponent<CommitListProps> {
  render() {
    return (
      <BaseCommitList
        renderAuthorAvatar={renderAuthorAvatar}
        renderAuthorName={renderAuthorName}
        {...this.props}
      />
    );
  }
}

export class CommitSelector extends PureComponent<CommitSelectorProps> {
  render() {
    const { ...commitListProps } = this.props;

    return (
      <BaseCommitSelector
        renderAuthorAvatar={renderAuthorAvatar}
        renderAuthorName={renderAuthorName}
        {...commitListProps}
      />
    );
  }
}
