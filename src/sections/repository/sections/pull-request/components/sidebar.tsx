import React, { PureComponent } from 'react';

import { SpotlightManager, SpotlightTransition } from '@atlaskit/onboarding';

import { PullRequest, Repository, BuildStatus } from 'src/components/types';
import { ResizeProps } from 'src/components/sidebar';

import { ConnectPullRequestWebCards } from 'src/connect/web-cards';
import urls from 'src/redux/pull-request/urls';
import Sidebar from 'src/sections/global/containers/sidebar';
import SidebarKeyboardShortcuts from 'src/sections/repository/components/sidebar-keyboard-shortcuts';
import BuildStatusCard from 'src/containers/build-status-card';
import JiraIssuesCard from 'src/sections/repository/sections/pull-request/components/jira-issues-card';
import baseUrls from 'src/urls/source';
import CurrentPullRequestFileTree from '../containers/pull-request-file-tree';
import { PullRequestTasks } from '../containers/tasks';
import PullRequestFeedbackCard from '../containers/pull-request-feedback-card';
import MergeChecklist from '../containers/merge-checklist';
import CodeInsights from '../components/code-insights';
import PullRequestActivityCard from './pull-request-activity/pull-request-activity-card';
import {
  WelcomeTour,
  PullRequestWelcomeTourTarget,
  WelcomeTourTarget,
} from './welcome-dialog';
import { TaskMode } from './tasks/tasks';

type PullRequestSidebarProps = {
  expandedWidth: number;
  pullRequestInStateMatchesRoute: boolean;
  isCollapsed?: boolean;
  onResize: (props: ResizeProps) => void;
  pullRequest: PullRequest;
  repository: Repository;
  toggleSidebar: () => void;
  hasMergeChecklistFeature: boolean;
  oldPullRequestUrl: string;
  builds: BuildStatus[];
  updateBuilds: (builds: BuildStatus) => void;
  endTour: () => void;
  isWelcomeTourActive: boolean;
};

class PullRequestSidebar extends PureComponent<PullRequestSidebarProps> {
  componentWillUnmount() {
    // end tour if page changes
    // (e.g. user pressed back in browser)
    this.props.endTour();
  }

  // @ts-ignore TODO: fix noImplicitAny error here
  onBuildsLoaded = builds => {
    this.props.updateBuilds(builds);
  };

  render() {
    // We are passing this to the sidebar, which adds a `key` for us
    const expandedContent: JSX.Element[] = [];
    const collapsedContent: JSX.Element[] = [];

    const {
      pullRequestInStateMatchesRoute,
      pullRequest,
      repository,
      builds,
      isWelcomeTourActive,
    } = this.props;

    const expandedIfTourIsActive = isWelcomeTourActive
      ? { initialCardIsCollapsed: false }
      : {};

    if (pullRequestInStateMatchesRoute && repository && pullRequest) {
      const [owner, repoSlug] = repository.full_name.split('/');
      const pullRequestId = pullRequest.id;
      const buildStatusURL = urls.api.v20.statusesFetch(
        owner,
        repoSlug,
        pullRequestId
      );
      const repositoryMetadataURL = baseUrls.api.internal.repositoryMetadataURL(
        repository.full_name
      );

      if (this.props.hasMergeChecklistFeature) {
        // @ts-ignore
        expandedContent.push(<MergeChecklist />);
        collapsedContent.push(
          // @ts-ignore
          <MergeChecklist isCollapsed />
        );
      }

      collapsedContent.push(
        <BuildStatusCard
          builds={builds}
          buildStatusURL={buildStatusURL}
          repositoryMetadataURL={repositoryMetadataURL}
          isCollapsed
          updatesFavicon
        />
      );
      expandedContent.push(
        <BuildStatusCard
          buildStatusURL={buildStatusURL}
          repositoryMetadataURL={repositoryMetadataURL}
          onBuildsLoaded={this.onBuildsLoaded}
          updatesFavicon
        />
      );

      expandedContent.push(
        <WelcomeTourTarget
          name={PullRequestWelcomeTourTarget.Files}
          key={`${PullRequestWelcomeTourTarget.Files}-${isWelcomeTourActive}`}
        >
          <CurrentPullRequestFileTree {...expandedIfTourIsActive} />
        </WelcomeTourTarget>
      );
      collapsedContent.push(<CurrentPullRequestFileTree isCollapsed />);

      expandedContent.push(
        <PullRequestTasks
          initialMode={TaskMode.Read}
          isSidebarCollapsed={false}
          shouldRepressFetch={false}
        />
      );
      collapsedContent.push(
        <PullRequestTasks
          initialMode={TaskMode.Read}
          isSidebarCollapsed
          shouldRepressFetch
        />
      );

      collapsedContent.push(<JiraIssuesCard isSidebarCollapsed />);
      expandedContent.push(<JiraIssuesCard />);

      expandedContent.push(<CodeInsights />);
      collapsedContent.push(<CodeInsights isCollapsed />);

      collapsedContent.push(<ConnectPullRequestWebCards isCollapsed />);
      expandedContent.push(<ConnectPullRequestWebCards />);
    }
    expandedContent.push(<PullRequestActivityCard />);
    collapsedContent.push(<PullRequestActivityCard isCollapsed />);
    expandedContent.push(
      <WelcomeTourTarget
        name={PullRequestWelcomeTourTarget.Feedback}
        key={`${PullRequestWelcomeTourTarget.Feedback}-${isWelcomeTourActive}`}
      >
        <PullRequestFeedbackCard
          optOutUrl={this.props.oldPullRequestUrl}
          {...expandedIfTourIsActive}
        />
      </WelcomeTourTarget>
    );

    return (
      <SidebarKeyboardShortcuts
        sidebarType="code-review"
        toggleSidebar={this.props.toggleSidebar}
      >
        <SpotlightManager>
          <WelcomeTourTarget name={PullRequestWelcomeTourTarget.Sidebar}>
            <Sidebar
              expandedWidth={this.props.expandedWidth}
              collapsedContent={collapsedContent}
              expandedContent={expandedContent}
              isCollapsed={!!this.props.isCollapsed}
              onResize={this.props.onResize}
            />
          </WelcomeTourTarget>
          <SpotlightTransition>
            <WelcomeTour />
          </SpotlightTransition>
        </SpotlightManager>
      </SidebarKeyboardShortcuts>
    );
  }
}

export default PullRequestSidebar;
