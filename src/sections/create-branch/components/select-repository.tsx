import React from 'react';
import { InjectedIntl } from 'react-intl';
// @ts-ignore TODO: fix noImplicitAny error here
import Select from '@atlaskit/select';

import { LOADING_STATE } from '../constants';
import { RepositorySelector, SelectOption } from '../types';
import { limit, optionFilter } from '../utils';
import messages from './create-branch.i18n';
import * as styles from './create-branch.style';
import CustomSelectOption from './custom-select-option';

type SelectRepositoryProps = {
  intl: InjectedIntl;
  isCreating: boolean;
  onChangeRepository: (payload: SelectOption) => void;
  repositorySelector: RepositorySelector;
};

type State = {
  // Currently visible options in select (filtered and limited)
  options: SelectOption[];
};

// Max number of repository options we render in the select to keep rendering/filtering snappy
export const REPOSITORY_LIMIT = 100;

export default class SelectRepository extends React.PureComponent<
  SelectRepositoryProps,
  State
> {
  state = {
    options: [],
  };

  componentDidUpdate(prevProps: SelectRepositoryProps) {
    if (
      this.props.repositorySelector.repositories !==
      prevProps.repositorySelector.repositories
    ) {
      this.setOptions();
    }
  }

  handleInputChange = (inputValue: string) => {
    this.setOptions(inputValue);
  };

  setOptions(inputValue = '') {
    let options;
    if (!inputValue) {
      options = this.getFilteredOptions();
    } else {
      options = this.getFilteredOptions(option =>
        optionFilter(option, inputValue)
      );
    }

    this.setState({
      options,
    });
  }

  getFilteredOptions = (
    predicate?: (option: SelectOption) => boolean
  ): SelectOption[] => {
    const { intl } = this.props;
    const { values, hasMore } = limit(
      this.props.repositorySelector.repositories,
      REPOSITORY_LIMIT,
      predicate
    );
    if (hasMore) {
      values.push({
        value: '',
        label: intl.formatMessage(messages.repositorySelectorMoreOptions),
        isDisabled: true,
        data: undefined,
      });
    }
    return values;
  };

  render() {
    const {
      intl,
      isCreating,
      repositorySelector: { loadingState, repositories, selected },
    } = this.props;

    let placeholder: string | null = null;
    if (loadingState === LOADING_STATE.SUCCESS && !repositories.length) {
      placeholder = intl.formatMessage(
        messages.repositorySelectorNoRepositories
      );
    } else if (loadingState === LOADING_STATE.ERROR) {
      placeholder = intl.formatMessage(messages.repositorySelectorLoadError);
    }

    return (
      <styles.FieldWrapper id="select-repository">
        <styles.FormLabel>
          {intl.formatMessage(messages.repositoryLabel)}
        </styles.FormLabel>
        <Select
          backspaceRemovesValue={false}
          components={{ Option: CustomSelectOption }}
          // We do our own filtering in handleInputChange, no need to filter again
          filterOption={null}
          isDisabled={isCreating || placeholder !== null}
          isLoading={loadingState === LOADING_STATE.LOADING}
          noOptionsMessage={() =>
            intl.formatMessage(messages.repositorySelectorNoMatches)
          }
          onChange={this.props.onChangeRepository}
          onClickPreventDefault={false}
          onInputChange={this.handleInputChange}
          options={this.state.options}
          placeholder={placeholder}
          value={selected}
        />
      </styles.FieldWrapper>
    );
  }
}
