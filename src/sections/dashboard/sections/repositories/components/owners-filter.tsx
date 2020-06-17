import React, { PureComponent } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import Avatar from '@atlaskit/avatar';
// @ts-ignore TODO: fix noImplicitAny error here
import Select from '@atlaskit/select';
import { gridSize } from '@atlaskit/theme';
import debounce from 'lodash-es/debounce';

import {
  OwnerSelectorOption,
  RepositoryFilters,
  Owner,
} from 'src/sections/dashboard/types';

import i18n from './owners-filter.i18n';
import * as filtersStyles from './filters.styles';
import * as styles from './owner-filter.styles';

const INPUT_CHANGE_DEBOUNCE_TIME = 500;

type Props = {
  intl: InjectedIntl;
  isLoading: boolean;
  isError: boolean;
  owners: Owner[];
  selectedOwnerUuid: string | null;
  selectedOwner: Owner | null;
  onFilterChange: (filter: Partial<RepositoryFilters>) => void;
  fetchOwners: (query: string) => void;
  fetchAndSelectOwner: (uuid: string) => void;
  selectOwner: (owner: Owner | null) => void;
  clearFilteredOwners: () => void;
};

export class OwnersFilter extends PureComponent<Props> {
  componentDidMount() {
    const { selectedOwnerUuid, fetchAndSelectOwner } = this.props;

    if (selectedOwnerUuid !== null) {
      fetchAndSelectOwner(selectedOwnerUuid);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const isOwnerChangedViaBrowserHistory =
      this.props.selectedOwner === prevProps.selectedOwner &&
      this.props.selectedOwnerUuid !== prevProps.selectedOwnerUuid;

    if (isOwnerChangedViaBrowserHistory) {
      // eslint-disable-next-line no-unused-expressions
      this.props.selectedOwnerUuid === null
        ? this.props.selectOwner(null)
        : this.props.fetchAndSelectOwner(this.props.selectedOwnerUuid);
    }
  }

  formatOptionLabel = (option: OwnerSelectorOption) => {
    const { value: owner, label } = option;
    const avatarProps = owner
      ? {
          name: owner.display_name,
          src: owner.avatar_url,
        }
      : { name: label };

    return (
      <styles.OwnerSelectorOption>
        <Avatar {...avatarProps} size="small" />
        <filtersStyles.Ellipsis>{label}</filtersStyles.Ellipsis>
      </styles.OwnerSelectorOption>
    );
  };

  mapFilterOption = (owner: Owner): OwnerSelectorOption => {
    return {
      label: owner.display_name,
      value: owner,
    };
  };

  getNoOptionsMessage = () => {
    const { intl, isError } = this.props;

    if (isError) {
      return intl.formatMessage(i18n.filterOwnerError);
    }

    return intl.formatMessage(i18n.filterOwnerNoOptions);
  };

  handleChange = (option: OwnerSelectorOption | null) => {
    if (option && option.value) {
      const { value: owner } = option;

      this.props.selectOwner(owner);
      this.props.onFilterChange({ owner: owner.uuid });
    }

    if (option === null && this.props.selectedOwner) {
      this.props.selectOwner(null);
      this.props.onFilterChange({ owner: null });
    }
  };

  // @ts-ignore TODO: fix noImplicitAny error here
  handleInputChange = (inputValue: string, { action }) => {
    const { fetchOwners, clearFilteredOwners } = this.props;

    if (action === 'input-change') {
      // eslint-disable-next-line no-unused-expressions
      inputValue.length > 0 ? fetchOwners(inputValue) : clearFilteredOwners();
    } else if (action === 'menu-close') {
      clearFilteredOwners();
    }
  };

  handleInputChangeDebounced = debounce(
    this.handleInputChange,
    INPUT_CHANGE_DEBOUNCE_TIME
  );

  render() {
    const { intl, isLoading, owners, selectedOwner } = this.props;

    const selectedOwnerOption = selectedOwner
      ? this.mapFilterOption(selectedOwner)
      : null;

    return (
      <div>
        <Select
          isClearable
          blurInputOnSelect
          isLoading={isLoading}
          isDisabled={isLoading}
          options={owners.map(this.mapFilterOption)}
          placeholder={intl.formatMessage(i18n.filterOwner)}
          formatOptionLabel={this.formatOptionLabel}
          noOptionsMessage={this.getNoOptionsMessage}
          onChange={this.handleChange}
          onInputChange={this.handleInputChangeDebounced}
          value={
            isLoading
              ? {
                  label: intl.formatMessage(i18n.filterOwnerLoading),
                  value: null,
                }
              : selectedOwnerOption
          }
          styles={{
            // @ts-ignore TODO: fix noImplicitAny error here
            control: (css, state) => ({
              ...css,
              ...filtersStyles.subtleSelector(css, state),
              width: selectedOwnerOption ? gridSize() * 28 : gridSize() * 14,
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

export default injectIntl(OwnersFilter);
