import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { ReactRenderer } from '@atlaskit/renderer';
import { FabricConversation } from 'src/components/conversation-provider/types';
import { providerFactory } from 'src/components/fabric-html-renderer';
import messages from './pull-request-activity-events.i18n';
import * as styles from './pull-request-event.styled';
import { CommentContextMessage } from './comment-context-message';
import { usePublishActivityUiEvent } from './hooks';

type Props = {
  event: FabricConversation;
};

export const PullRequestCommentStartEntry = ({ event }: Props) => {
  const publish = usePublishActivityUiEvent('comment-start');
  const { meta, comments } = event;
  const firstComment = comments[0];

  return (
    <Fragment>
      <styles.RightToLeftContainer>
        <FormattedMessage {...messages.commentEventMessage} />{' '}
        <CommentContextMessage
          id={firstComment.commentId}
          meta={meta}
          onPermalinkClick={publish}
        />
      </styles.RightToLeftContainer>
      {firstComment.document && (
        <styles.CommentSnippet>
          <ReactRenderer
            // @ts-ignore Might have different versions of dataProviders def
            dataProviders={providerFactory}
            document={firstComment.document.adf}
            truncated
            maxHeight={72}
          />
        </styles.CommentSnippet>
      )}
    </Fragment>
  );
};
