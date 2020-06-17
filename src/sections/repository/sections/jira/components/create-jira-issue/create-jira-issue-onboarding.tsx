import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Spotlight, SpotlightTransition } from '@atlaskit/onboarding';

import { useIntl } from 'src/hooks/intl';
import { BucketState } from 'src/types/state';
import { OnboardingViewed } from 'src/redux/jira/constants';
import { LoadingStatus } from 'src/constants/loading-status';
import { publishScreenEvent } from 'src/utils/analytics/publish';
import {
  fetchCreateJiraIssueOnboardingViewed,
  updateCreateJiraIssueOnboardingViewed,
} from 'src/redux/jira/actions/create-jira-issue';
import messages from './create-jira-issue-onboarding.i18n';

export const TARGETS = {
  ISSUE_SUMMARY: 'create-jira-issue-summary',
  ISSUE_ACTIONS: 'create-jira-issue-actions',
};

export const CreateJiraIssueOnboarding = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [active, setActive] = useState<null | number>(null);

  const { viewed, fetchedStatus } = useSelector<
    BucketState,
    { viewed: OnboardingViewed; fetchedStatus: LoadingStatus }
  >(state => {
    return state.jira.createJiraIssue.onboarding;
  });

  const start = () => setActive(0);
  const next = () => setActive((active as number) + 1);
  const finish = () => {
    setActive(null);
    dispatch(updateCreateJiraIssueOnboardingViewed(OnboardingViewed.Seen));
  };

  const renderActiveSpotlight = () => {
    const spotlights = [
      <Spotlight
        actions={[
          {
            onClick: finish,
            text: intl.formatMessage(messages.skipButtonLabel),
          },
          {
            onClick: next,
            text: intl.formatMessage(messages.nextButtonLabel),
          },
        ]}
        dialogPlacement="right middle"
        target={TARGETS.ISSUE_SUMMARY}
        key={TARGETS.ISSUE_SUMMARY}
      >
        <FormattedMessage {...messages.issueSummaryOnboardingMessage} />
      </Spotlight>,
      <Spotlight
        actions={[
          {
            onClick: finish,
            text: intl.formatMessage(messages.gotItButtonLabel),
          },
        ]}
        dialogPlacement="right middle"
        target={TARGETS.ISSUE_ACTIONS}
        key={TARGETS.ISSUE_ACTIONS}
      >
        <FormattedMessage {...messages.issueCreationActionsOnboardingMessage} />
      </Spotlight>,
    ];

    if (active === null) {
      return null;
    } else {
      return spotlights[active];
    }
  };

  useEffect(() => {
    if (fetchedStatus === LoadingStatus.Before) {
      dispatch(fetchCreateJiraIssueOnboardingViewed());
    }
  }, [fetchedStatus, dispatch]);

  useEffect(() => {
    if (viewed === OnboardingViewed.Unseen) {
      start();
      publishScreenEvent('createJiraIssueFromPullRequestCommentOnboarding');
    }
  }, [viewed]);

  return <SpotlightTransition>{renderActiveSpotlight()}</SpotlightTransition>;
};
