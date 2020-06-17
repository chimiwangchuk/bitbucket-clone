import Avatar from '@atlaskit/avatar';
import LockFilledIcon from '@atlaskit/icon/glyph/lock-filled';
// @ts-ignore TODO: fix noImplicitAny error here
import Truncate from 'react-truncate';
import React, { Fragment, PureComponent, ComponentType } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import { RelativeDate } from '@atlassian/bitkit-date';
import { getName, getProfileUrl } from '@atlassian/bitbucket-user-profile';
import { Repository as RepositorySchema } from 'src/components/types';
import {
  getRepoOwnerName,
  getRepoOwnerUrl,
} from 'src/sections/repository/utils/repository-owner';
import {
  RepositoryLinkProps,
  withRepository,
} from 'src/components/repository-link';
import { SubtleLink } from 'src/styles';

import {
  TableCellMobileHidden,
  TableCellMobileOnly,
} from 'src/components/pageable-table';
import ItemInfo from 'src/components/pull-requests-table/item-info';
import RepositoryBuildStatus from 'src/components/repository-table/repository-build-status';
import messages from './repository.i18n';
import * as styles from './repository.style';

type RepositoryRowProps = {
  intl: InjectedIntl;
  isWorkspaceUiEnabled?: boolean;
  repository: RepositorySchema;
  repositoryLinkComponent?: ComponentType<RepositoryLinkProps>;
  isFocused: boolean;
};

class Repository extends PureComponent<RepositoryRowProps> {
  repoLinkRef: HTMLAnchorElement | null | undefined;

  componentDidUpdate(prevProps: RepositoryRowProps) {
    if (!this.repoLinkRef) {
      return;
    }

    if (!prevProps.isFocused && this.props.isFocused) {
      this.repoLinkRef.focus();
      return;
    }

    if (prevProps.isFocused && !this.props.isFocused) {
      this.repoLinkRef.blur();
    }
  }

  handleRepoLinkRef = (ref: HTMLAnchorElement | null | undefined) => {
    this.repoLinkRef = ref;
  };

  renderSummary({ showAvatar = true } = {}) {
    const {
      repository,
      repositoryLinkComponent: LinkComponent,
      intl,
      isWorkspaceUiEnabled,
    } = this.props;

    const { project } = repository;

    const projectLink =
      project && project.links ? project.links.html.href : null;
    const repositoryLink = repository.links.html.href;

    const updatedOn = repository.updated_on
      ? new Date(repository.updated_on)
      : null;

    const ownerHref = getRepoOwnerUrl(repository);
    const ownerName = getRepoOwnerName(repository);
    const profileUrl = getProfileUrl(repository.owner);
    const name = getName(repository.owner, intl);

    return (
      <ItemInfo
        avatar={
          showAvatar ? (
            <Avatar
              name={repository.name}
              src={repository.links.avatar.href}
              appearance="square"
              component={
                LinkComponent
                  ? withRepository(repository)(LinkComponent)
                  : undefined
              }
              href={repositoryLink}
            />
          ) : null
        }
        byline={
          <styles.Info>
            {isWorkspaceUiEnabled ? (
              <SubtleLink href={ownerHref}>{ownerName}</SubtleLink>
            ) : profileUrl ? (
              <SubtleLink href={profileUrl}>{name}</SubtleLink>
            ) : (
              name
            )}

            {!!project && !!project.name && (
              <Fragment>
                {' / '}
                <SubtleLink href={projectLink || ''}>{project.name}</SubtleLink>
              </Fragment>
            )}

            {updatedOn && (
              <Fragment>
                {` - `}
                <RelativeDate date={updatedOn} />
              </Fragment>
            )}
          </styles.Info>
        }
        header={
          <styles.HeaderLinkWrapper>
            {LinkComponent ? (
              <LinkComponent
                repository={repository}
                innerRef={this.handleRepoLinkRef}
              />
            ) : (
              <a
                href={repository.links.html.href}
                ref={ref => {
                  this.repoLinkRef = ref;
                }}
              >
                {repository.name}
              </a>
            )}
          </styles.HeaderLinkWrapper>
        }
      />
    );
  }

  renderDesktopRow() {
    const { repository, intl } = this.props;
    const { is_private: isPrivate } = repository;

    return (
      <Fragment>
        <TableCellMobileHidden colSpan={4}>
          {this.renderSummary()}
        </TableCellMobileHidden>
        <TableCellMobileHidden colSpan={4}>
          <styles.Description title={repository.description}>
            <Truncate lines={2}>{repository.description}</Truncate>
          </styles.Description>
        </TableCellMobileHidden>
        <TableCellMobileHidden colSpan={2}>
          <RepositoryBuildStatus repository={repository} />
        </TableCellMobileHidden>
        <styles.IsPrivateRepositoryCellMobileHidden colSpan={2}>
          {isPrivate && (
            <styles.PrivateIcon>
              <LockFilledIcon
                label={intl.formatMessage(messages.privateRepositoryIcon)}
                size="medium"
              />
            </styles.PrivateIcon>
          )}
        </styles.IsPrivateRepositoryCellMobileHidden>
      </Fragment>
    );
  }

  renderMobileRow() {
    const { repository, intl } = this.props;
    const { is_private: isPrivate } = repository;

    return (
      <Fragment>
        <TableCellMobileOnly colSpan={7}>
          {this.renderSummary({ showAvatar: false })}
        </TableCellMobileOnly>
        <TableCellMobileOnly colSpan={3}>
          <RepositoryBuildStatus repository={repository} />
        </TableCellMobileOnly>
        <styles.IsPrivateRepositoryCellMobileOnly colSpan={2}>
          {isPrivate && (
            <styles.PrivateIcon>
              <LockFilledIcon
                label={intl.formatMessage(messages.privateRepositoryIcon)}
                size="medium"
              />
            </styles.PrivateIcon>
          )}
        </styles.IsPrivateRepositoryCellMobileOnly>
      </Fragment>
    );
  }

  render() {
    const { isFocused } = this.props;

    return (
      <styles.RepositoryRow isFocused={isFocused}>
        {this.renderDesktopRow()}
        {this.renderMobileRow()}
      </styles.RepositoryRow>
    );
  }
}

export default injectIntl(Repository);
