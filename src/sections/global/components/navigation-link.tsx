import React, { PureComponent, ReactNode } from 'react';

import ApdexMeasuredLink from 'src/components/apdex-measured-link';
import { ComponentLinkProxy as ComponentLink } from 'src/components/component-link';
import { MenuItem } from 'src/components/navigation';
import { ApdexTask } from 'src/types/apdex';
import urls from 'src/components/navigation/src/urls';

type NavigationLinkProps = {
  children: ReactNode;
  href: string;
  className: string;
  menuItem?: MenuItem;
  onClick?: (event: React.SyntheticEvent<HTMLAnchorElement>) => any;
};

const taskNames: { [K: string]: ApdexTask } = {
  source: ApdexTask.Source,
  commits: ApdexTask.Commits,
  branches: ApdexTask.Branches,
  pullrequests: ApdexTask.PullRequests,
  'create-branch': ApdexTask.RepoCreateBranch,
  pipelines: ApdexTask.PipelineList,
  dashboard: ApdexTask.DashboardOverview,
};

export default class NavigationLink extends PureComponent<NavigationLinkProps> {
  // @ts-ignore TODO: fix noImplicitAny error here
  getTaskName(menuItem: MenuItem | undefined, isPipelines, isLinkToDashboard) {
    if (isPipelines) {
      return taskNames.pipelines;
    } else if (isLinkToDashboard) {
      return taskNames.dashboard;
    }

    // tabName should always be defined in that case
    const tabName = menuItem ? menuItem.tab_name : '';

    return taskNames[tabName];
  }

  render() {
    const { children, href, menuItem } = this.props;
    const hasTaskName =
      menuItem &&
      menuItem.type === 'menu_item' &&
      menuItem.tab_name in taskNames;

    const isPipelines =
      menuItem &&
      menuItem.type === 'connect_menu_item' &&
      menuItem.label === 'Pipelines';

    const isLinkToDashboard = href === urls.ui.root();

    if ((menuItem && (hasTaskName || isPipelines)) || isLinkToDashboard) {
      return (
        <ApdexMeasuredLink
          {...this.props}
          to={href}
          task={this.getTaskName(menuItem, isPipelines, isLinkToDashboard)}
        >
          {children}
        </ApdexMeasuredLink>
      );
    }

    return <ComponentLink {...this.props}>{children}</ComponentLink>;
  }
}
