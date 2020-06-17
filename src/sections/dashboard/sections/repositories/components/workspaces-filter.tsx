import React, { PureComponent } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import Avatar from '@atlaskit/avatar';
// @ts-ignore TODO: fix noImplicitAny error here
import Select from '@atlaskit/select';
import { gridSize } from '@atlaskit/theme';
import debounce from 'lodash-es/debounce';
import get from 'lodash-es/get';

import {
  WorkspaceSelectorOption,
  RepositoryFilters,
} from 'src/sections/dashboard/types';
import { Workspace } from 'src/components/types';

import i18n from './workspaces-filter.i18n';
import * as filtersStyles from './filters.styles';
import * as styles from './workspace-filter.styles';

const INPUT_CHANGE_DEBOUNCE_TIME = 500;

type Props = {
  intl: InjectedIntl;
  isLoading: boolean;
  isError: boolean;
  workspaces: Workspace[];
  selectedWorkspaceUuid: string | null;
  selectedWorkspace: Workspace | null;
  onFilterChange: (filter: Partial<RepositoryFilters>) => void;
  fetchWorkspaces: (query: string) => void;
  fetchAndSelectWorkspace: (uuid: string) => void;
  selectWorkspace: (workspace: Workspace | null) => void;
  clearFilteredWorkspaces: () => void;
};

export class WorkspacesFilter extends PureComponent<Props> {
  componentDidMount() {
    const { selectedWorkspaceUuid, fetchAndSelectWorkspace } = this.props;

    if (selectedWorkspaceUuid !== null) {
      fetchAndSelectWorkspace(selectedWorkspaceUuid);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const isWorkspaceChangedViaBrowserHistory =
      this.props.selectedWorkspace === prevProps.selectedWorkspace &&
      this.props.selectedWorkspaceUuid !== prevProps.selectedWorkspaceUuid;

    if (isWorkspaceChangedViaBrowserHistory) {
      // eslint-disable-next-line no-unused-expressions
      this.props.selectedWorkspaceUuid === null
        ? this.props.selectWorkspace(null)
        : this.props.fetchAndSelectWorkspace(this.props.selectedWorkspaceUuid);
    }
  }

  formatOptionLabel = (option: WorkspaceSelectorOption) => {
    const { value: workspace, label } = option;
    const avatarProps = workspace
      ? {
          name: workspace.name,
          src: get(workspace, 'links.avatar.href'),
        }
      : { name: label };

    return (
      <styles.WorkspaceSelectorOption>
        <Avatar {...avatarProps} size="small" />
        <filtersStyles.Ellipsis>{label}</filtersStyles.Ellipsis>
      </styles.WorkspaceSelectorOption>
    );
  };

  mapFilterOption = (workspace: Workspace): WorkspaceSelectorOption => {
    return {
      label: workspace.name,
      value: workspace,
    };
  };

  getNoOptionsMessage = () => {
    const { intl, isError } = this.props;

    if (isError) {
      return intl.formatMessage(i18n.filterWorkspaceError);
    }

    return intl.formatMessage(i18n.filterWorkspaceNoOptions);
  };

  handleChange = (option: WorkspaceSelectorOption | null) => {
    if (option && option.value) {
      const { value: workspace } = option;

      this.props.selectWorkspace(workspace);
      this.props.onFilterChange({ workspace: workspace.uuid });
    }

    if (option === null && this.props.selectedWorkspace) {
      this.props.selectWorkspace(null);
      this.props.onFilterChange({ workspace: null });
    }
  };

  // @ts-ignore TODO: fix noImplicitAny error here
  handleInputChange = (inputValue: string, { action }) => {
    const { fetchWorkspaces, clearFilteredWorkspaces } = this.props;

    if (action === 'input-change') {
      // eslint-disable-next-line no-unused-expressions
      inputValue.length > 0
        ? fetchWorkspaces(inputValue)
        : clearFilteredWorkspaces();
    } else if (action === 'menu-close') {
      clearFilteredWorkspaces();
    }
  };

  handleInputChangeDebounced = debounce(
    this.handleInputChange,
    INPUT_CHANGE_DEBOUNCE_TIME
  );

  render() {
    const { intl, isLoading, workspaces, selectedWorkspace } = this.props;

    const selectedWorkspaceOption = selectedWorkspace
      ? this.mapFilterOption(selectedWorkspace)
      : null;

    return (
      <div>
        <Select
          isClearable
          blurInputOnSelect
          isLoading={isLoading}
          isDisabled={isLoading}
          options={workspaces.map(this.mapFilterOption)}
          placeholder={intl.formatMessage(i18n.filterWorkspace)}
          formatOptionLabel={this.formatOptionLabel}
          noOptionsMessage={this.getNoOptionsMessage}
          onChange={this.handleChange}
          onInputChange={this.handleInputChangeDebounced}
          value={
            isLoading
              ? {
                  label: intl.formatMessage(i18n.filterWorkspaceLoading),
                  value: null,
                }
              : selectedWorkspaceOption
          }
          styles={{
            // @ts-ignore TODO: fix noImplicitAny error here
            control: (css, state) => ({
              ...css,
              ...filtersStyles.subtleSelector(css, state),
              width: selectedWorkspaceOption
                ? gridSize() * 28
                : gridSize() * 17,
            }),
            // @ts-ignore TODO: fix noImplicitAny error here
            menu: css => ({
              ...css,
              minWidth: gridSize() * 24,
            }),
            // @ts-ignore TODO: fix noImplicitAny error here
            placeholder: css => ({
              ...css,
              ...filtersStyles.nothingSelectedColor(),
            }),
          }}
        />
      </div>
    );
  }
}

export default injectIntl(WorkspacesFilter);
