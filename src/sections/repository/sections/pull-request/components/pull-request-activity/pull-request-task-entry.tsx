import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import Button from '@atlaskit/button';
import { ActivityApi } from 'src/components/activity/types';
import { COLLAPSE_TASKS_CARD } from 'src/redux/pull-request/actions';
import scrollTo from 'src/redux/global/actions/scroll-to';
import { scrollPastStickyHeaders } from 'src/redux/pull-request/sagas/scrolling-sagas';
import messages from './pull-request-activity-events.i18n';
import * as styles from './pull-request-event.styled';

type Props = {
  event: ActivityApi['TaskActivity'];
};

export const PullRequestTaskEntry = React.memo(({ event }: Props) => {
  const dispatch = useDispatch();
  const { action } = event.task;
  const { content } = event.task.task;
  const openTaskCard = () => {
    const permalink = 'sidebar-tasks';
    dispatch({
      type: COLLAPSE_TASKS_CARD,
      payload: false,
    });
    // Wait after task card has finished expanding
    setTimeout(
      () =>
        dispatch(
          scrollTo({
            targetId: permalink,
            customBehavior: scrollPastStickyHeaders(permalink),
          })
        ),
      200
    );
  };

  let actionFormattedMessage;

  if (action === 'CREATED') {
    actionFormattedMessage = (
      <Fragment>
        <FormattedMessage {...messages.taskCreatedEventMessage} />{' '}
        <Button appearance="link" spacing="none" onClick={openTaskCard}>
          <FormattedMessage {...messages.taskEventMessage} />
        </Button>
      </Fragment>
    );
  } else {
    actionFormattedMessage = (
      <Fragment>
        <FormattedMessage {...messages.taskResolvedEventMessage} />{' '}
        <Button appearance="link" spacing="none" onClick={openTaskCard}>
          <FormattedMessage {...messages.taskEventMessage} />
        </Button>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <styles.MessageText>{actionFormattedMessage}</styles.MessageText>{' '}
      <styles.CommentSnippet>{content.raw}</styles.CommentSnippet>
    </Fragment>
  );
});

export default PullRequestTaskEntry;
