import { InjectedIntl, injectIntl } from 'react-intl';
import React from 'react';
import { Checkbox } from '@atlaskit/checkbox';
import Select, { StylesConfig, OptionType } from '@atlaskit/select';
import { colors, gridSize } from '@atlaskit/theme';
import { LoadingStatus } from 'src/constants/loading-status';
import {
  PrCommentJiraIssue,
  IssueTransitionFormRowData,
} from 'src/redux/jira/types';
import messages from './issue-transition-form-row.i18n';
import * as styles from './issue-transition-form-row.style';

type IssueTransitionFormRowProps = {
  intl: InjectedIntl;
  jiraIssues: PrCommentJiraIssue[];
  issueTransitionFormRow: IssueTransitionFormRowData;
  updateIssueTransition: (row: IssueTransitionFormRowData) => void;
  fetchAvailableIssueTransitions: () => void;
};
const IssueTransitionFormRow: React.FC<IssueTransitionFormRowProps> = ({
  intl,
  jiraIssues,
  issueTransitionFormRow,
  updateIssueTransition,
  fetchAvailableIssueTransitions,
}) => {
  const transitionSelectOptions = issueTransitionFormRow.availableIssueTransitions.map(
    transition => ({
      label: transition.name,
      value: transition.id,
    })
  );

  const issueSelectOptions = jiraIssues.map(jiraIssue => ({
    label: jiraIssue.issue.key,
    value: jiraIssue.issue.id,
  }));

  const handleCheckboxClick = () => {
    updateIssueTransition({
      ...issueTransitionFormRow,
      shouldTransition: !issueTransitionFormRow.shouldTransition,
    });
  };
  const onChangeIssueSelect = (selected: OptionType) => {
    updateIssueTransition({
      ...issueTransitionFormRow,
      selectedIssue: jiraIssues.find(
        jiraIssue => jiraIssue.issue.id === selected.value
      ),
    });
    fetchAvailableIssueTransitions();
  };
  const onChangeTransitionSelect = (selected: OptionType) => {
    updateIssueTransition({
      ...issueTransitionFormRow,
      selectedTransition: issueTransitionFormRow.availableIssueTransitions.find(
        transition => transition.id === selected.value
      ),
    });
  };

  const issueCustomStyles: StylesConfig = {
    container: provided => ({
      ...provided,
      width: gridSize() * 11,
    }),
    control: provided => ({
      ...provided,
      backgroundColor: colors.N0,
      border: colors.N0,
    }),
    singleValue: provided => ({
      ...provided,
      fontWeight: 'bold',
    }),
    valueContainer: provided => ({
      ...provided,
      paddingLeft: 0,
    }),
    dropdownIndicator: provided => ({
      ...provided,
      color: colors.N800,
    }),
  };

  const transitionCustomStyles: StylesConfig = {
    ...issueCustomStyles,
    container: provided => ({
      ...provided,
      width: gridSize() * 15,
    }),
  };

  return (
    <styles.LineContainer>
      <Checkbox
        label={intl.formatMessage(messages.transitionIssues)}
        isChecked={issueTransitionFormRow.shouldTransition}
        onChange={handleCheckboxClick}
      />
      <styles.SelectContainer>
        <Select
          options={issueSelectOptions}
          onChange={onChangeIssueSelect}
          styles={issueCustomStyles}
          isSearchable={false}
          menuPlacement="top"
          placeholder={intl.formatMessage(messages.issue)}
        />
      </styles.SelectContainer>
      {intl.formatMessage(messages.to)}
      <styles.SelectContainer>
        <Select
          options={transitionSelectOptions}
          onChange={onChangeTransitionSelect}
          styles={transitionCustomStyles}
          isSearchable={false}
          menuPlacement="top"
          isDisabled={
            issueTransitionFormRow.availableIssueTransitionsFetchedStatus !==
            LoadingStatus.Success
          }
          placeholder={intl.formatMessage(messages.status)}
        />
      </styles.SelectContainer>
    </styles.LineContainer>
  );
};

export default injectIntl(IssueTransitionFormRow);
