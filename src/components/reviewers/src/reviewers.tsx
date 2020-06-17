import { SizeType, AvatarPropTypes } from '@atlaskit/avatar';
import AvatarGroup from '@atlaskit/avatar-group';
import React, { Component } from 'react';
import { injectIntl, FormattedMessage, InjectedIntl } from 'react-intl';
import { relativeDateString } from '@atlassian/bitkit-date';
import { PullRequest, PullRequestParticipant } from 'src/components/types';

import {
  getAvatarUrl,
  getName,
  getProfileUrl,
  DeletedUserAvatar,
  DeletedUserAvatarProps,
  UserAvatar,
  UserAvatarProps,
} from '@atlassian/bitbucket-user-profile';

import getReviewers from './get-reviewers';
import messages from './reviewers.i18n';

type AvatarWrapperProps = Partial<AvatarPropTypes> &
  (UserAvatarProps | DeletedUserAvatarProps);

const AvatarWrapper = (props: AvatarWrapperProps) => {
  return 'user' in props && !!props.user ? (
    <UserAvatar {...props} />
  ) : (
    <DeletedUserAvatar {...props} />
  );
};

export type ReviewersProps = {
  /** The currently logged-in Bitbucket user. */
  currentUserUuid?: string | undefined;
  /** A flag indicating whether or not to include an href to each reviewer's profile */
  removeLinksToProfiles?: boolean;
  /** The pull request to render the reviewers for. */
  pullRequest: PullRequest | undefined;
  maxCount: number;
  appearance?: 'grid' | 'stack';
  /** Defines the size of the avatars. */
  size?: SizeType;
  isDisabled?: boolean;
  tabIndex?: number;
};

type InjectedProps = {
  intl: InjectedIntl;
};

export class ReviewersBase extends Component<ReviewersProps & InjectedProps> {
  transformAvatar = (reviewer: PullRequestParticipant): AvatarWrapperProps => {
    const { intl, isDisabled, removeLinksToProfiles, tabIndex } = this.props;
    const user = reviewer.user as BB.User | BB.Team | undefined;

    const renderName = (privateName: string) =>
      reviewer.approved
        ? intl.formatMessage(messages.approved, {
            display_name: privateName,
            datetime: relativeDateString(reviewer.participated_on, intl),
          })
        : privateName;

    // These need to be manually passed through because `AvatarGroup` renders
    // plain AK Avatars in the "more" dropdown rather than our custom `UserAvatar`
    // component that would normally fill those values in for us. Use the same
    // methods to generate these that `UserAvatar` uses internally, for consistency
    const href = (!removeLinksToProfiles && getProfileUrl(user)) || undefined;
    const name = renderName(getName(user, intl));
    const src = getAvatarUrl(user) || undefined;

    return {
      appearance: 'circle',
      enableTooltip: true,
      href,
      isDisabled,
      name,
      renderName,
      size: this.props.size || 'medium',
      src,
      status: reviewer.approved ? 'approved' : undefined,
      user,
      tabIndex,
    };
  };

  render() {
    const {
      currentUserUuid,
      pullRequest,
      intl,
      size,
      isDisabled,
      ...otherProps
    } = this.props;

    if (!pullRequest) {
      return null;
    }
    const reviewers = getReviewers(pullRequest, currentUserUuid);

    if (!reviewers.length) {
      return <FormattedMessage tagName="em" {...messages.noReviewers} />;
    }

    const avatars: Array<Partial<AvatarPropTypes>> = reviewers.map(
      this.transformAvatar
    );

    const optionalOnMoreClick = isDisabled ? { onMoreClick: () => null } : {};

    return (
      <AvatarGroup
        avatar={AvatarWrapper}
        data={avatars}
        size={size}
        {...optionalOnMoreClick}
        {...otherProps}
      />
    );
  }
}

export default injectIntl(ReviewersBase);
