import React, { Fragment, ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { noop } from 'lodash-es';
import { InlineField } from 'src/components/conversation-provider/types';
import { cleanPath } from 'src/utils/filename';
import { getPermalink } from 'src/utils/permalink-helpers';
import { BucketState } from 'src/types/state';
import {
  getIsFileHiddenFromDiff,
  getIsFileRemovedFromDiff,
} from 'src/redux/pull-request/selectors';
import messages from './pull-request-activity-events.i18n';
import * as styles from './pull-request-event.styled';

type Contents = {
  [key: string]: unknown;
  global: () => ReactElement;
  file: (props: { meta: InlineField }) => string;
  inline: (props: { meta: InlineField }) => string;
};

const messageContext: Contents = {
  global: () => <FormattedMessage {...messages.pullRequestContextMessage} />,
  file: ({ meta }) => cleanPath(meta.path),
  inline: ({ meta }) => `${cleanPath(meta.path)}:${meta.to || meta.from}`,
};

type Props = {
  onPermalinkClick?: () => void;
  meta: InlineField;
  id: string | number;
};

export const CommentContextMessage = React.memo(
  ({ meta, id, onPermalinkClick = noop }: Props) => {
    const permalink = `comment-${id}`;
    const isGlobalLevel = !meta.path;
    const isFileLevel = !!meta.path && !meta.to && !meta.from;

    const handleClick = React.useCallback(
      (e: React.SyntheticEvent<HTMLAnchorElement>) => {
        const permalinkFromCurrentUrl = getPermalink();
        if (permalink === permalinkFromCurrentUrl) {
          // prevent incorrect browser scrolling if a user clicks the permalink again
          e.preventDefault();
        }
        onPermalinkClick();
      },
      [permalink, onPermalinkClick]
    );

    const level = isGlobalLevel ? 'global' : isFileLevel ? 'file' : 'inline';
    const contextMessage = messageContext[level]({ meta });

    const isFileRemoved = useSelector((state: BucketState) => {
      const filePath = meta.path ? meta.path : '';
      return getIsFileRemovedFromDiff(state, filePath);
    });

    const isFileHidden = useSelector((state: BucketState) => {
      const filePath = meta.path ? meta.path : '';
      return getIsFileHiddenFromDiff(state, filePath);
    });

    const shouldShowNotShown = !isGlobalLevel && isFileHidden;
    const shouldShowRemoved = !isGlobalLevel && isFileRemoved;
    const shouldShowOutdated =
      !isGlobalLevel && !isFileRemoved && meta.outdated;

    return (
      <Fragment>
        <a href={`#${permalink}`} onClick={handleClick}>
          {shouldShowRemoved ? (
            <styles.DeletedFile>{contextMessage}</styles.DeletedFile>
          ) : (
            contextMessage
          )}
        </a>

        {shouldShowNotShown && (
          <FormattedMessage {...messages.fileNotRendered}>
            {text => <Fragment> [{text}]</Fragment>}
          </FormattedMessage>
        )}
        {/* appended labels for OUTDATED or REMOVED are exclusive of each other and REMOVED wins over OUTDATED */}
        {shouldShowRemoved && (
          <FormattedMessage {...messages.fileRemoved}>
            {text => <Fragment> [{text}]</Fragment>}
          </FormattedMessage>
        )}
        {shouldShowOutdated && (
          <FormattedMessage {...messages.outdatedComment}>
            {text => <Fragment> [{text}]</Fragment>}
          </FormattedMessage>
        )}
      </Fragment>
    );
  }
);
