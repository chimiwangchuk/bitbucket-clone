import React from 'react';
import BitbucketBranchesIcon from '@atlaskit/icon/glyph/bitbucket/branches';
import BitbucketCommitsIcon from '@atlaskit/icon/glyph/bitbucket/commits';
import BitbucketCompareIcon from '@atlaskit/icon/glyph/bitbucket/compare';
import BitbucketPullrequestsIcon from '@atlaskit/icon/glyph/bitbucket/pullrequests';
import BitbucketReposIcon from '@atlaskit/icon/glyph/bitbucket/repos';
import BitbucketSnippetsIcon from '@atlaskit/icon/glyph/bitbucket/snippets';
import MarketplaceIcon from '@atlaskit/icon/glyph/marketplace';
import DocumentsIcon from '@atlaskit/icon/glyph/documents';
import EditorCodeIcon from '@atlaskit/icon/glyph/editor/code';
import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
import FileIcon from '@atlaskit/icon/glyph/file';
import FolderIcon from '@atlaskit/icon/glyph/folder';
import FollowersIcon from '@atlaskit/icon/glyph/followers';
import FollowingIcon from '@atlaskit/icon/glyph/following';
import GraphLineIcon from '@atlaskit/icon/glyph/graph-line';
import ImageIcon from '@atlaskit/icon/glyph/image';
import IssuesIcon from '@atlaskit/icon/glyph/issues';
import LockIcon from '@atlaskit/icon/glyph/lock';
import LockCircleIcon from '@atlaskit/icon/glyph/lock-circle';
import PageIcon from '@atlaskit/icon/glyph/page';
import PeopleIcon from '@atlaskit/icon/glyph/people';
import PersonIcon from '@atlaskit/icon/glyph/person';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import TaskIcon from '@atlaskit/icon/glyph/task';
import TrayIcon from '@atlaskit/icon/glyph/tray';
import WorldIcon from '@atlaskit/icon/glyph/world';
import AkTooltip from '@atlaskit/tooltip';
import { JiraSoftwareIcon } from '@atlaskit/logo';
import { MenuItem } from '../types';
import ConnectMenuItemIcon from './connect-menu-item-icon';

const icons = {
  overview: TrayIcon,
  downloads: FileIcon,
  source: EditorCodeIcon,
  commits: BitbucketCommitsIcon,
  branches: BitbucketBranchesIcon,
  followers: FollowersIcon,
  following: FollowingIcon,
  marketplace: MarketplaceIcon,
  members: PersonIcon,
  teams: PeopleIcon,
  projects: FolderIcon,
  repositories: BitbucketReposIcon,
  snippets: BitbucketSnippetsIcon,
  pullrequests: BitbucketPullrequestsIcon,
  issues: IssuesIcon,
  wiki: PageIcon,
  admin: SettingsIcon,
  security: LockCircleIcon,
  supportadmin: SettingsIcon,
  search: TrayIcon,
  'staff-access': LockIcon,
  'disk-usage': DocumentsIcon,
  'media-usage': ImageIcon,
  'feature-change-log': FileIcon,
  'feature-diff': BitbucketCompareIcon,
  'connect-stats': GraphLineIcon,
  'environment-settings': WorldIcon,
  workspace: DashboardIcon,
  utils: TaskIcon,
  // @ts-ignore TODO: fix noImplicitAny error here
  jira: ({ label }) => <JiraSoftwareIcon label={label} size="small" />,
};

export const renderMenuItemIcon = (
  menuItem: MenuItem,
  isNavigationOpen = true
) => {
  if (menuItem.type === 'connect_menu_item') {
    const connectIcon = <ConnectMenuItemIcon menuItem={menuItem} />;

    return isNavigationOpen ? (
      connectIcon
    ) : (
      <AkTooltip position="right" content={menuItem.label}>
        {connectIcon}
      </AkTooltip>
    );
  }

  if (menuItem.type === 'menu_item') {
    // @ts-ignore TODO: fix noImplicitAny error here
    const IconComponent = icons[menuItem.tab_name];

    if (!IconComponent) {
      return null;
    }

    const icon = <IconComponent label={menuItem.label} size="medium" />;

    return isNavigationOpen ? (
      icon
    ) : (
      <AkTooltip position="right" content={menuItem.label}>
        {icon}
      </AkTooltip>
    );
  }

  return null;
};

export default icons;
