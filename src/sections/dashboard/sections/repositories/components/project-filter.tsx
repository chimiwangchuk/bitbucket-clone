import debounce from 'lodash-es/debounce';
import React, { PureComponent } from 'react';
import Avatar from '@atlaskit/avatar';
import { gridSize } from '@atlaskit/theme';
// @ts-ignore TODO: fix noImplicitAny error here
import Select from '@atlaskit/select';
import { InjectedIntl, injectIntl } from 'react-intl';

import * as filterStyles from 'src/sections/repository/styles/filters';
import {
  RepositoryFilters,
  ProjectOption,
  ProjectUrlState,
} from 'src/sections/dashboard/types';
import { Project } from 'src/components/types';
import * as styles from './project-filter.style';

import messages from './project-filter.i18n';

type Props = {
  intl: InjectedIntl;
  isLoading: boolean;
  isError: boolean;
  fetchProjects: (search?: string) => void;
  selectProject: (project: Project | null) => void;
  clearFilteredProjects: () => void;
  fetchAndSelectProject: (project: ProjectUrlState) => void;
  selectedProjectInfo: ProjectUrlState | null;
  selectedProject: Project | null;
  onFilterChange: (filters: Partial<RepositoryFilters>) => void;
  projects: Project[];
};

class ProjectFilter extends PureComponent<Props> {
  componentDidMount() {
    const { selectedProjectInfo } = this.props;

    this.props.fetchProjects();
    if (selectedProjectInfo) {
      this.props.fetchAndSelectProject(selectedProjectInfo);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const isProjectChangedViaBrowserHistory =
      this.props.selectedProjectInfo !== prevProps.selectedProjectInfo &&
      this.props.selectedProject === prevProps.selectedProject;
    if (isProjectChangedViaBrowserHistory) {
      // eslint-disable-next-line no-unused-expressions
      this.props.selectedProjectInfo === null
        ? this.props.selectProject(null)
        : this.props.fetchAndSelectProject(this.props.selectedProjectInfo);
    }
  }

  handleProjectChange = (option: ProjectOption) => {
    if (option && option.value) {
      const { value: project } = option;

      this.props.selectProject(project);
      this.props.onFilterChange({
        project: {
          owner: project.owner ? project.owner.uuid : '',
          key: project.key,
        },
      });
    }

    if (option === null && this.props.selectedProject) {
      this.props.selectProject(null);
      this.props.onFilterChange({ project: null });
    }
  };

  mapFilterOption = (project: Project | null) => {
    return project
      ? {
          label: project.name,
          value: project,
        }
      : null;
  };

  // @ts-ignore TODO: fix noImplicitAny error here
  handleInputChange = (inputValue: string, { action }) => {
    if (action === 'input-change') {
      this.props.fetchProjects(inputValue);
    }
    if (action === 'menu-close') {
      this.props.clearFilteredProjects();
    }
  };

  formatOptionLabel = (option: ProjectOption) => {
    const { label, value } = option;

    return (
      <styles.ProjectOption>
        <Avatar
          src={value.links ? value.links.avatar.href : undefined}
          size="small"
        />
        <filterStyles.Ellipsis>{label}</filterStyles.Ellipsis>
      </styles.ProjectOption>
    );
  };

  getNoOptionsMessage = () => {
    const { intl, isError } = this.props;

    if (isError) {
      return intl.formatMessage(messages.filterError);
    }

    return intl.formatMessage(messages.filterNoOptions);
  };

  handleInputChangeDebounce = debounce(this.handleInputChange, 400);

  render() {
    const {
      intl,
      isLoading,
      projects,
      selectedProjectInfo,
      selectedProject: project,
    } = this.props;

    const selectedProject = this.mapFilterOption(project);

    return (
      <div data-qa="select-dashboard-repo-project">
        <Select
          isClearable
          blurInputOnSelect
          isLoading={isLoading}
          isDisabled={isLoading}
          options={projects.map(this.mapFilterOption)}
          placeholder={intl.formatMessage(messages.filterProject)}
          formatOptionLabel={this.formatOptionLabel}
          noOptionsMessage={this.getNoOptionsMessage}
          onChange={this.handleProjectChange}
          onInputChange={this.handleInputChangeDebounce}
          value={selectedProject}
          styles={{
            // @ts-ignore TODO: fix noImplicitAny error here
            control: (css, state) => ({
              ...css,
              ...filterStyles.subtleSelector(css, state),
              minWidth: selectedProjectInfo ? gridSize() * 28 : gridSize() * 14,
              maxWidth: gridSize() * 28,
            }),
            // @ts-ignore TODO: fix noImplicitAny error here
            menu: css => ({
              ...css,
              minWidth: gridSize() * 24,
            }),
            // @ts-ignore TODO: fix noImplicitAny error here
            placeholder: css => ({
              ...css,
              ...filterStyles.nothingSelectedColor(),
            }),
          }}
        />
      </div>
    );
  }
}

export default injectIntl(ProjectFilter);
