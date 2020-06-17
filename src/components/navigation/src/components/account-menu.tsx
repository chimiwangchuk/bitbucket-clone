import React, { PureComponent, ReactNode } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import AkAvatar from '@atlaskit/avatar';
import { getProfileUrl } from '@atlassian/bitbucket-user-profile';

import urls from '../urls';
import { DropdownItem, DropdownItemGroup } from './dropdown-helpers';
import messages from './account-menu.i18n';

export type AccountMenuUserProps = {
  hasAtlassianAccount: boolean | undefined;
  userAccountStatus: string | undefined;
  userAvatarUrl: string | undefined;
  userDisplayName: string | undefined;
  userHtmlUrl: string | undefined;
  userUuid: string | undefined;
  userWorkspaceId: string | undefined;
  hasWorkspaceUi?: boolean;
};

export type AccountMenuProps = AccountMenuUserProps & {
  aaLogoutUrl: string;
  canonUrl: string;
  teams: BB.Team[];
  recentlyViewedWorkspacesKeys?: string[];
  isAkDropdown?: boolean;
};

type Props = AccountMenuProps & {
  intl: InjectedIntl;
};

class AccountMenu extends PureComponent<Props> {
  static defaultProps = {
    hasWorkspaceUi: false,
  };

  getAnonymousMenuItems() {
    const { intl, isAkDropdown } = this.props;

    // Once Bitbucket Core is on React 16, we can use a Fragment instead of an
    // array of DropdownItem elements
    return [
      <DropdownItem
        isAkDropdown={isAkDropdown}
        href={urls.ui.login()}
        key="login-link"
      >
        {intl.formatMessage(messages.logInLink)}
      </DropdownItem>,
      <DropdownItem
        isAkDropdown={isAkDropdown}
        href={urls.ui.signup()}
        key="signup-link"
      >
        {intl.formatMessage(messages.signUpLink)}
      </DropdownItem>,
    ];
  }

  sortList(workspaceSlug?: string) {
    const { teams, hasWorkspaceUi, recentlyViewedWorkspacesKeys } = this.props;
    if (hasWorkspaceUi) {
      if (
        recentlyViewedWorkspacesKeys &&
        recentlyViewedWorkspacesKeys.length > 0
      ) {
        // We have recently viewed workspaces, let's put those on top
        // of the dropdown menu
        const sortedTeams: BB.Team[] = [];
        recentlyViewedWorkspacesKeys.forEach(key => {
          const workspaceIndex = teams.findIndex(team => team.uuid === key);
          const workspace = teams[workspaceIndex];
          if (workspace) {
            sortedTeams.push(workspace);
          }
        });
        teams
          .filter(team => !recentlyViewedWorkspacesKeys.includes(team.uuid))
          .forEach(team => sortedTeams.push(team));
        return sortedTeams;
      } else {
        // No recently viewed workspaces.
        // Keep the "personal" workspace at the top of the dropdown menu
        if (workspaceSlug) {
          const workspaceIndex = teams.findIndex(
            team => team.slug === workspaceSlug
          );
          const workspace = teams[workspaceIndex];
          if (workspace) {
            teams.splice(workspaceIndex, 1);
            teams.unshift(workspace);
          }
        }
        return teams;
      }
    }
    return teams;
  }

  getTeamMenuItems(workspaceSlug?: string) {
    const {
      hasWorkspaceUi,
      userDisplayName,
      userUuid,
      userHtmlUrl,
      userAccountStatus,
      intl,
      teams,
      isAkDropdown,
    } = this.props;
    const hasUser = !!userDisplayName;

    if (!hasUser || !teams || teams.length === 0) {
      return [];
    }

    const sortedTeam: BB.Team[] = this.sortList(workspaceSlug);

    const menuItems: ReactNode[] = sortedTeam
      // display only 3 teams in the menu (link to teams page if more)
      .slice(0, 3)
      .map(team => (
        <DropdownItem
          isAkDropdown={isAkDropdown}
          href={getProfileUrl(team) || undefined}
          key={team.uuid}
          elemBefore={
            <AkAvatar
              size="xsmall"
              appearance={hasWorkspaceUi ? 'square' : 'circle'}
              src={team.links.avatar.href}
            />
          }
        >
          {team.display_name ? team.display_name : ''}
        </DropdownItem>
      ));

    const profileUrl =
      userAccountStatus !== 'closed' ? userHtmlUrl || userUuid : undefined;
    if (!hasWorkspaceUi && teams.length > 3 && profileUrl) {
      const teamsUrl = `${profileUrl}profile/teams`;
      menuItems.push(
        <DropdownItem
          isAkDropdown={isAkDropdown}
          href={teamsUrl}
          key={teamsUrl}
        >
          {intl.formatMessage(messages.viewAllTeamsLink)}
        </DropdownItem>
      );
    }
    if (hasWorkspaceUi) {
      menuItems.push(
        <DropdownItem
          isAkDropdown={isAkDropdown}
          href={urls.ui.allWorkspaces()}
          key={urls.ui.allWorkspaces()}
        >
          {intl.formatMessage(messages.viewAllWorkspacesLink)}
        </DropdownItem>
      );
    }

    return [
      <DropdownItemGroup
        isAkDropdown={isAkDropdown}
        title={intl.formatMessage(
          hasWorkspaceUi ? messages.workspacesHeader : messages.teamsHeader
        )}
        key="teams-group"
      >
        {menuItems}
      </DropdownItemGroup>,
    ];
  }

  getAuthenticatedMenuItems() {
    const {
      aaLogoutUrl,
      canonUrl,
      userHtmlUrl,
      userUuid,
      userWorkspaceId,
      userDisplayName,
      hasAtlassianAccount,
      hasWorkspaceUi,
      intl,
      isAkDropdown,
    } = this.props;

    if (!userDisplayName) {
      return [];
    }

    const workspaceSlug = userWorkspaceId;

    // Once Bitbucket Core is on React 16, we can use a Fragment instead of an
    // array of DropdownItem elements
    return [
      ...this.getTeamMenuItems(workspaceSlug),
      <DropdownItemGroup
        isAkDropdown={isAkDropdown}
        title={userDisplayName || ''}
        key="authenticated-user-group"
      >
        {userHtmlUrl && !hasWorkspaceUi ? (
          <DropdownItem isAkDropdown={isAkDropdown} href={userHtmlUrl}>
            {intl.formatMessage(messages.viewProfileLink)}
          </DropdownItem>
        ) : null}
        <DropdownItem
          isAkDropdown={isAkDropdown}
          href={userUuid && urls.ui.settings(userUuid, hasWorkspaceUi)}
        >
          {intl.formatMessage(
            hasWorkspaceUi
              ? messages.workspaceUISettingsLink
              : messages.settingsLink
          )}
        </DropdownItem>
        {!hasWorkspaceUi && (
          <DropdownItem
            href={urls.ui.integrations()}
            isAkDropdown={isAkDropdown}
          >
            {intl.formatMessage(messages.integrationsLink)}
          </DropdownItem>
        )}
        <DropdownItem
          href={urls.ui.labs(hasWorkspaceUi)}
          isAkDropdown={isAkDropdown}
        >
          {intl.formatMessage(
            hasWorkspaceUi ? messages.workspaceUILabsLink : messages.labsLink
          )}
        </DropdownItem>
        <DropdownItem
          isAkDropdown={isAkDropdown}
          href={
            hasAtlassianAccount
              ? urls.external.atlassianAccountLogout(aaLogoutUrl, canonUrl)
              : urls.ui.logout()
          }
        >
          {intl.formatMessage(
            hasWorkspaceUi
              ? messages.workspaceUILogoutLink
              : messages.logOutLink
          )}
        </DropdownItem>
      </DropdownItemGroup>,
    ];
  }

  render() {
    return this.props.userDisplayName !== undefined
      ? this.getAuthenticatedMenuItems()
      : this.getAnonymousMenuItems();
  }
}

export default injectIntl(AccountMenu);
