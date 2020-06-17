import BitbucketPullrequestsIcon from '@atlaskit/icon/glyph/bitbucket/pullrequests';
import { colors } from '@atlaskit/theme';
import { AkNavigationItem } from '@atlaskit/quick-search';
import React, { ComponentType, PureComponent } from 'react';
import { makePullRequestDrawerLink } from '../with-pull-request-drawer-link';
import { PullRequestGlobalSearchResult } from '../../types';
import * as styles from './icon.style';

type Props = {
  pullRequest: PullRequestGlobalSearchResult;
  onSearchDrawerClose: () => void;
  isSearchDrawerOpen: boolean;
  pullRequestLinkComponent?: ComponentType<{
    href: string;
    title: string;
    onClick: (e: MouseEvent) => void;
  }>;
};

export default class PullRequestResult extends PureComponent<Props> {
  render() {
    const {
      pullRequest,
      pullRequestLinkComponent,
      onSearchDrawerClose,
      isSearchDrawerOpen,
      ...props
    } = this.props;
    const text = `#${pullRequest.localId}: ${pullRequest.title}`;

    const icon = (
      <styles.Icon backgroundColor={colors.N30}>
        <BitbucketPullrequestsIcon label={text} />
      </styles.Icon>
    );

    return (
      <AkNavigationItem
        icon={icon}
        text={text}
        subText={pullRequest.repo}
        href={pullRequest.url}
        linkComponent={
          pullRequestLinkComponent
            ? makePullRequestDrawerLink(
                { ...pullRequest, id: pullRequest.localId },
                {
                  pullRequestUrl: pullRequest.url,
                  onSearchDrawerClose,
                  isSearchDrawerOpen,
                }
              )(pullRequestLinkComponent)
            : undefined
        }
        {...props}
      />
    );
  }
}
