import { useSelector, useDispatch } from 'react-redux';
import { Label } from '@atlaskit/field-base';
import { InjectedIntl, injectIntl } from 'react-intl';
import React from 'react';
import { BucketState } from 'src/types/state';
import { PullRequestJiraIssuesState } from 'src/redux/jira/reducers/pull-request-jira-issues';
import {
  updateIssueTransition,
  fetchAvailableIssueTransitions,
  addIssueTransition,
} from 'src/redux/jira/actions';
import { PrCommentJiraIssue } from 'src/redux/jira/types';
import IssueTransitionFormRow from '../issue-transition-form-row/issue-transition-form-row';
import messages from './issue-transition-form.i18n';
import * as styles from './issue-transition-form.style';

type IssueTransitionFormProps = {
  intl: InjectedIntl;
  pullRequestJiraIssues: PrCommentJiraIssue[];
};
const IssueTransitionForm: React.FC<IssueTransitionFormProps> = ({
  intl,
  pullRequestJiraIssues,
}) => {
  const pullRequestJiraIssuesState = useSelector<
    BucketState,
    PullRequestJiraIssuesState
  >(state => state.jira.pullRequestJiraIssues);
  const dispatch = useDispatch();

  const { issueTransitionFormData } = pullRequestJiraIssuesState;

  return (
    <>
      <Label label={intl.formatMessage(messages.transitionIssues)} />
      {issueTransitionFormData.map((row, index) => (
        <IssueTransitionFormRow
          key={index}
          jiraIssues={pullRequestJiraIssues}
          issueTransitionFormRow={row}
          updateIssueTransition={newTransition =>
            dispatch(updateIssueTransition({ index, newTransition }))
          }
          fetchAvailableIssueTransitions={() =>
            dispatch(fetchAvailableIssueTransitions(index))
          }
        />
      ))}
      <styles.AddTransitionButton
        appearance="subtle"
        spacing="none"
        onClick={() => dispatch(addIssueTransition())}
        iconBefore={
          <styles.StyledEditorAddIcon
            label={intl.formatMessage(messages.addTransition)}
          />
        }
      >
        <styles.LineContainer>
          {intl.formatMessage(messages.addTransition)}
        </styles.LineContainer>
      </styles.AddTransitionButton>
    </>
  );
};

export default injectIntl(IssueTransitionForm);
