import Tooltip from '@atlaskit/tooltip';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './i18n';

const authorEmailRegex = /<.*>$/;

export const parseCommitAuthor = (rawCommitAuthor: string | undefined) => {
  if (rawCommitAuthor === undefined) {
    return undefined;
  }

  const unknownAuthor = ''; // show blank if raw commit author is not present

  if (!rawCommitAuthor.trim()) {
    return unknownAuthor;
  }
  const name = rawCommitAuthor.replace(authorEmailRegex, '').trim();
  return name.trim() || unknownAuthor;
};

type Props = {
  /** A flag to disable the tooltip indicating the author cannot be matched to a Bitbucket account. */
  disableTooltip?: boolean;
  /** The raw value of the commit's "author" field. */
  rawCommitAuthor: string;
};

class UnmatchedCommitAuthorName extends PureComponent<Props> {
  static defaultProps = {
    disableTooltip: false,
  };

  render() {
    const { disableTooltip, rawCommitAuthor } = this.props;
    const text = parseCommitAuthor(rawCommitAuthor);

    if (!text) {
      return null;
    }

    if (disableTooltip) {
      return text;
    }

    return (
      <Tooltip
        content={
          <FormattedMessage {...messages.unmatchedUnknownCommitAuthorTooltip} />
        }
        position="bottom"
        tag="span"
      >
        <span>{text}</span>
      </Tooltip>
    );
  }
}

export default UnmatchedCommitAuthorName;
