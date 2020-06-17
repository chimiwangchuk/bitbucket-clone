import React from 'react';
import { FormattedMessage } from 'react-intl';
// @ts-ignore TODO: fix noImplicitAny error here
import { PopupSelect } from '@atlaskit/select';
import DownIcon from '@atlaskit/icon/glyph/chevron-down';
import Task16Icon from '@atlaskit/icon-object/glyph/task/16';
import Spinner from '@atlaskit/spinner';

import { IssueType } from 'src/redux/jira/types';
import { LoadingStatus } from 'src/constants/loading-status';
import { publishUiEvent } from 'src/utils/analytics/publish';
import messages from './issue-type-chooser.i18n';
import { TargetButton, DownIconWrapper } from './popup-select-target.styled';
import {
  IssueTypeChooserWrapper,
  IssueTypeImage,
  CustomOption,
  IssueTypeIcon,
  CustomOptionLabel,
} from './issue-type-chooser.styled';

type Props = {
  fetchedStatus: LoadingStatus;
  isDisabled: boolean;
  issueTypes: IssueType[];
  onSelectedChange: (selected: IssueType) => void;
  selected?: IssueType;
};

type OptionType = {
  value: string;
  label: string;
  issueType: IssueType;
};

// @ts-ignore TODO: fix noImplicitAny error here
const formatOptionLabel = (option: OptionType, { context }) => {
  if (context === 'menu') {
    return (
      <CustomOption>
        <IssueTypeIcon src={option.issueType.iconUrl} />
        <CustomOptionLabel>{option.label}</CustomOptionLabel>
      </CustomOption>
    );
  }
  return option.label;
};

const targetLabel = (
  fetchedStatus: LoadingStatus,
  issueTypes: IssueType[],
  selected: IssueType | undefined
) => {
  if (fetchedStatus === LoadingStatus.Failed) {
    return <FormattedMessage {...messages.issueTypesFailedToLoadMessage} />;
  } else if (fetchedStatus === LoadingStatus.Success && selected) {
    return <IssueTypeImage src={selected.iconUrl} />;
  } else if (
    fetchedStatus === LoadingStatus.Success &&
    issueTypes.length === 0
  ) {
    return <FormattedMessage {...messages.noIssueTypesMessage} />;
  }
  return '';
};

const isLoading = (fetchedStatus: LoadingStatus) =>
  !(
    fetchedStatus === LoadingStatus.Success ||
    fetchedStatus === LoadingStatus.Failed ||
    fetchedStatus === LoadingStatus.Forbidden
  );

// @ts-ignore TODO: fix noImplicitAny error here
const renderIcon = fetchedStatus => {
  if (isLoading(fetchedStatus)) {
    return <Spinner size="small" />;
  } else if (fetchedStatus === LoadingStatus.Forbidden) {
    return <Task16Icon size="small" label="issue type chooser" />;
  } else {
    return (
      <DownIconWrapper>
        <DownIcon label="issue type chooser" />
      </DownIconWrapper>
    );
  }
};

export const IssueTypeChooser = ({
  fetchedStatus,
  isDisabled,
  issueTypes,
  onSelectedChange,
  selected,
}: Props) => {
  return (
    <IssueTypeChooserWrapper>
      {/*
      // @ts-ignore "value" prop is typed incorrectly */}
      <PopupSelect
        closeMenuOnSelect
        formatOptionLabel={formatOptionLabel}
        // @ts-ignore TODO: fix noImplicitAny error here
        styles={{ container: styles => ({ ...styles, maxWidth: 600 }) }}
        maxMenuHeight={400}
        spacing="compact"
        isLoading={isLoading(fetchedStatus)}
        isDisabled={isDisabled}
        onClickPreventDefault={false}
        backspaceRemovesValue={false}
        value={
          selected
            ? {
                label: selected.name,
                value: selected.id,
                issueType: selected,
              }
            : undefined
        }
        onChange={({ issueType }: { issueType: IssueType }) => {
          onSelectedChange(issueType);
          publishUiEvent({
            action: 'changed',
            actionSubject: 'option',
            actionSubjectId: 'createJiraIssueIssueTypeChooser',
            source: 'pullRequestScreen',
          });
        }}
        options={issueTypes.map(issueType => ({
          label: issueType.name,
          value: issueType.id,
          issueType,
        }))}
        searchThreshold={10}
        noOptionsMessage={() =>
          targetLabel(fetchedStatus, issueTypes, selected)
        }
        // @ts-ignore TODO: fix noImplicitAny error here
        target={({ ref }) => (
          <TargetButton
            isDisabled={isDisabled}
            appearance="subtle"
            ref={ref}
            iconAfter={renderIcon(fetchedStatus)}
          >
            {targetLabel(fetchedStatus, issueTypes, selected)}
          </TargetButton>
        )}
      />
    </IssueTypeChooserWrapper>
  );
};
