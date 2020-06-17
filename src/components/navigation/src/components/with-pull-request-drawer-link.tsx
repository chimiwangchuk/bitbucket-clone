import React, { Component, ComponentType } from 'react';
import { PullRequestGlobalSearchResult } from '../types';

type Props = {
  isSearchDrawerOpen: boolean;
  onSearchDrawerClose: () => void;
  pullRequestUrl: string;
};
// @ts-ignore TODO: fix noImplicitAny error here
const getDisplayName = c => c.displayName || c.name || 'Component';

const isPullRequest = (
  pullRequest: BB.PullRequest | PullRequestGlobalSearchResult
): pullRequest is BB.PullRequest => {
  return (pullRequest as BB.PullRequest).links !== undefined;
};

export const makePullRequestDrawerLink = (
  pullRequest: BB.PullRequest | PullRequestGlobalSearchResult,
  selectData: Props
) => (
  Comp: ComponentType<{
    href: string;
    title: string;
    onClick: (e: MouseEvent) => void;
  }>
) => {
  return class PullRequestDrawerLink extends Component<any> {
    static WrappedComponent = Comp;
    static displayName = `WithPullRequest(${getDisplayName(Comp)})`;

    onClick = (e: MouseEvent) => {
      if (this.props.onClick) {
        this.props.onClick(e);
      }

      if (selectData.isSearchDrawerOpen) {
        selectData.onSearchDrawerClose();
      }
    };

    render() {
      return (
        <Comp
          {...this.props}
          href={
            isPullRequest(pullRequest)
              ? pullRequest.links.html.href
              : selectData.pullRequestUrl
          }
          title={pullRequest.title}
          onClick={this.onClick}
        />
      );
    }
  };
};
