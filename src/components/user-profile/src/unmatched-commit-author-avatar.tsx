import Avatar, { AvatarPropTypes } from '@atlaskit/avatar';
import React, { PureComponent } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';

import messages from './i18n';
import { parseCommitAuthor } from './unmatched-commit-author-name';

type Props = {
  intl: InjectedIntl;
  /** The raw value of the commit's "author" field. */
  rawCommitAuthor?: string;
};

class UnmatchedCommitAuthorAvatar extends PureComponent<
  Props & AvatarPropTypes
> {
  render() {
    const { intl, rawCommitAuthor, ...avatarProps } = this.props;
    const parsedCommitAuthor = parseCommitAuthor(rawCommitAuthor);

    const tooltip = !parsedCommitAuthor
      ? intl.formatMessage(messages.unmatchedUnknownCommitAuthorTooltip)
      : intl.formatMessage(messages.unmatchedCommitAuthorTooltip, {
          commitAuthor: parsedCommitAuthor,
        });

    return <Avatar {...avatarProps} enableTooltip name={tooltip} />;
  }
}

export default injectIntl(UnmatchedCommitAuthorAvatar);
