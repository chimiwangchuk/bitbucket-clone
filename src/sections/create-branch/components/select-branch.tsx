import React from 'react';
import { FormattedMessage, InjectedIntl } from 'react-intl';
// @ts-ignore TODO: fix noImplicitAny error here
import Select, { components } from '@atlaskit/select';
import debounce from 'lodash-es/debounce';
import { FetchRefOptionsPayload } from 'src/redux/create-branch/actions';

import { Ref, RefOption, RefSelector } from '../types';
import { LOADING_STATE } from '../constants';
import messages from './create-branch.i18n';
import CustomSelectOption from './custom-select-option';

class CustomGroupHeading extends React.PureComponent<{ children: string }> {
  render() {
    const { children: messageKey, ...restProps } = this.props;
    return (
      <components.GroupHeading {...restProps}>
        <FormattedMessage {...(messages as any)[messageKey]} />
      </components.GroupHeading>
    );
  }
}

type SelectBranchProps = {
  intl: InjectedIntl;
  refSelector: RefSelector;
  onChangeFromBranch: (branch: Ref) => void;
  isCreating: boolean;
  isLoading: boolean;
  fetchRefOptions: (payload?: FetchRefOptionsPayload) => void;
  selectStyles: {};
};

export class SelectBranch extends React.PureComponent<SelectBranchProps> {
  hasInputChanged = false;

  handleSelectBranch = (option: RefOption) => {
    if (option.ref) {
      this.props.onChangeFromBranch(option.ref);
    }
  };

  // @ts-ignore TODO: fix noImplicitAny error here
  handleInputChange = (inputValue: string, { action }) => {
    if (action === 'input-change') {
      this.hasInputChanged = true;
      this.props.fetchRefOptions({
        search: inputValue,
      });
      return;
    }
    if (action === 'menu-close' && this.hasInputChanged) {
      this.hasInputChanged = false;
      this.props.fetchRefOptions();
    }
  };

  debouncedInputChange = debounce(this.handleInputChange, 500);

  getOptions = () => {
    const { refSelector, intl } = this.props;
    if (!refSelector.refs.length) {
      return [];
    }
    if (!refSelector.hasMoreRefs) {
      return refSelector.refs;
    }
    return [
      ...refSelector.refs,
      {
        label: intl.formatMessage(messages.refSelectorMoreOptions),
        value: '',
        isDisabled: true,
        data: undefined,
      },
    ];
  };

  render() {
    const {
      intl,
      isCreating,
      isLoading,
      selectStyles,
      refSelector: { loadingState, refs, selected },
    } = this.props;

    let placeholder: string | null = null;
    if (loadingState === LOADING_STATE.SUCCESS && !refs.length) {
      placeholder = intl.formatMessage(messages.refSelectorNoRefs);
    } else if (loadingState === LOADING_STATE.ERROR) {
      placeholder = intl.formatMessage(messages.refSelectorLoadError);
    }

    return (
      <Select
        backspaceRemovesValue={false}
        components={{
          GroupHeading: CustomGroupHeading,
          Option: CustomSelectOption,
        }}
        // We do our own filtering in handleInputChange, no need to filter again
        filterOption={null}
        isDisabled={isCreating || isLoading}
        isLoading={isLoading}
        menuPortalTarget={document.body}
        noOptionsMessage={() =>
          intl.formatMessage(messages.refSelectorNoMatches)
        }
        onChange={this.handleSelectBranch}
        onClickPreventDefault={false}
        onInputChange={this.debouncedInputChange}
        options={this.getOptions()}
        placeholder={placeholder}
        styles={selectStyles}
        value={selected}
      />
    );
  }
}
