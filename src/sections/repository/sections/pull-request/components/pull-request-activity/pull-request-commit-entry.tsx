import React, { Fragment, ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import Lozenge from '@atlaskit/lozenge';
import { CommitEntryHashItem } from 'src/components/activity/types';
import messages from './pull-request-activity-events.i18n';
import * as styles from './pull-request-event.styled';
import { usePublishActivityUiEvent } from './hooks';

type Props = {
  hashes: CommitEntryHashItem[];
};

export const PullRequestCommitEntry = ({ hashes }: Props) => {
  const publish = usePublishActivityUiEvent('commit-update');

  return (
    <Fragment>
      <Lozenge appearance="moved">
        <FormattedMessage {...messages.updatedEventLozenge} />
      </Lozenge>
      <styles.MessageText>
        <FormattedMessage
          {...messages.commitEventMessage}
          values={{ numOfCommits: hashes.length }}
        />
        :
      </styles.MessageText>{' '}
      <styles.CommitText>
        {hashes
          .map<ReactNode>(hashItem => (
            <a
              key={`${hashItem.url}-${hashItem.hash}`}
              href={hashItem.url || '#'}
              onClick={publish}
            >
              {hashItem.hash}
            </a>
          ))
          // join React elements with commas for the copy's sake eg. "hash1, hash2, hash3"
          .reduce((prev, curr) => [prev, ', ', curr])}
      </styles.CommitText>
    </Fragment>
  );
};
