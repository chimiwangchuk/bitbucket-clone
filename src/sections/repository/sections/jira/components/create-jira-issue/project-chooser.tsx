import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
// @ts-ignore TODO: fix noImplicitAny error here
import { PopupSelect } from '@atlaskit/select';
import DownIcon from '@atlaskit/icon/glyph/chevron-down';
import Spinner from '@atlaskit/spinner';

import { useIntl } from 'src/hooks/intl';
import { Project, Site } from 'src/redux/jira/types';
import { LoadingStatus } from 'src/constants/loading-status';
import { publishUiEvent } from 'src/utils/analytics/publish';
import messages from './project-chooser.i18n';
import {
  CustomOption,
  CustomOptionLabel,
  ProjectIcon,
  ProjectLabel,
} from './project-chooser.styled';
import {
  DownIconWrapper,
  TargetButton,
  TargetButtonText,
} from './popup-select-target.styled';

type Props = {
  fetchedStatus: LoadingStatus;
  isDisabled: boolean;
  onSelectedChange: (selected: Project) => void;
  projects: Project[];
  selected?: Project;
  fetchJiraProjectsForSite: (payload: {
    site: Site;
    projectFilter: string;
  }) => void;
  site: Site;
};

type OptionType = {
  value: string;
  label: string;
  project: Project;
};

// @ts-ignore TODO: fix noImplicitAny error here
const formatOptionLabel = (option: OptionType, { context }) => {
  if (context === 'menu') {
    return (
      <CustomOption>
        <ProjectIcon src={option.project.avatarUrls['16x16']} />
        <CustomOptionLabel>{option.label}</CustomOptionLabel>
      </CustomOption>
    );
  }
  return option.label;
};

const targetLabel = (
  fetchedStatus: LoadingStatus,
  projects: Project[],
  selected: Project | undefined,
  hasSearchQuery: boolean
) => {
  if (fetchedStatus === LoadingStatus.Failed) {
    return <FormattedMessage {...messages.projectsFailedToLoadMessage} />;
  } else if (fetchedStatus === LoadingStatus.Forbidden) {
    return <FormattedMessage {...messages.projectsForbiddenToLoadMessage} />;
  } else if (fetchedStatus === LoadingStatus.Success) {
    if (selected) {
      return `${selected.name} (${selected.key})`;
    } else if (projects.length === 0 && hasSearchQuery) {
      return <FormattedMessage {...messages.selectProjectMessage} />;
    } else if (projects.length === 0 && !hasSearchQuery) {
      return <FormattedMessage {...messages.noProjectsMessage} />;
    }
  }
  return '';
};

const isLoading = (fetchedStatus: LoadingStatus) =>
  !(
    fetchedStatus === LoadingStatus.Success ||
    fetchedStatus === LoadingStatus.Failed ||
    fetchedStatus === LoadingStatus.Forbidden
  );

export const ProjectChooser = ({
  fetchedStatus,
  isDisabled,
  onSelectedChange,
  projects,
  selected,
  fetchJiraProjectsForSite,
  site,
}: Props) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');

  // @ts-ignore TODO: fix noImplicitAny error here
  const handleInputChange = (inputVal: string, { action }) => {
    if (action === 'input-change') {
      setSearchQuery(inputVal);
      dispatch(
        fetchJiraProjectsForSite({
          site,
          projectFilter: inputVal,
        })
      );
    }
  };

  // We don't need to render a chooser if there is only one project.
  // But if there is a search query it may be because of the filtering we
  // are seeing only one project. So keep showing the chooser.
  if (
    fetchedStatus === LoadingStatus.Success &&
    projects.length === 1 &&
    !searchQuery
  ) {
    return (
      <ProjectLabel>{`${projects[0].name} (${projects[0].key})`}</ProjectLabel>
    );
  }

  return (
    <PopupSelect
      // We do our own filtering in handleInputChange, no need to filter again
      filterOption={null}
      inputValue={searchQuery}
      formatOptionLabel={formatOptionLabel}
      closeMenuOnSelect
      // @ts-ignore TODO: fix noImplicitAny error here
      styles={{ container: styles => ({ ...styles, maxWidth: 600 }) }}
      maxMenuHeight={400}
      spacing="compact"
      isLoading={isLoading(fetchedStatus)}
      isDisabled={isDisabled}
      onInputChange={handleInputChange}
      onClickPreventDefault={false}
      backspaceRemovesValue={false}
      value={
        selected
          ? {
              // @ts-ignore fix value.label type
              label: selected.name,
              value: selected.id,
              project: selected,
            }
          : undefined
      }
      // @ts-ignore TODO: fix noImplicitAny error here
      onChange={({ project }: { project: Project }, { action }) => {
        if (action === 'select-option') {
          onSelectedChange(project);
          publishUiEvent({
            action: 'changed',
            actionSubject: 'option',
            actionSubjectId: 'createJiraIssueProjectChooser',
            source: 'pullRequestScreen',
          });
        }
      }}
      options={[
        {
          label: intl.formatMessage(messages.projectsHeader),
          options: projects.map(project => ({
            label: `${project.name} (${project.key})`,
            value: project.id,
            project,
          })),
        },
      ]}
      // keep the search dialog open
      searchThreshold={-1}
      noOptionsMessage={() =>
        intl.formatMessage(messages.filterResultNoProjectMessage)
      }
      // @ts-ignore TODO: fix noImplicitAny error here
      target={({ ref }) => (
        <TargetButton
          appearance="subtle"
          ref={ref}
          iconAfter={
            isLoading(fetchedStatus) ? (
              <Spinner size="small" />
            ) : (
              <DownIconWrapper>
                <DownIcon label="expand site chooser" />
              </DownIconWrapper>
            )
          }
          isDisabled={isDisabled}
          spacing="compact"
        >
          <TargetButtonText>
            {targetLabel(fetchedStatus, projects, selected, !!searchQuery)}
          </TargetButtonText>
        </TargetButton>
      )}
    />
  );
};
