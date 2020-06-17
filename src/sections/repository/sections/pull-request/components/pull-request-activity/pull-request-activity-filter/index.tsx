import React from 'react';
import { injectIntl } from 'react-intl';
// @ts-ignore TODO: fix noImplicitAny error here
import Select from '@atlaskit/select';

import {
  FilterOptions,
  SelectableFilterOptions,
  VISIBLE_FILTER_OPTIONS,
} from './constants';
import messages, { filterLabels } from './i18n';
import { styles } from './styles';
import { PullRequestActivityFilterProps, StateOptionType } from './types';

class PullRequestActivityFilter extends React.PureComponent<
  PullRequestActivityFilterProps
> {
  private filterOptions: StateOptionType[] = VISIBLE_FILTER_OPTIONS.map(
    (key: SelectableFilterOptions): StateOptionType => ({
      label: this.props.intl.formatMessage(filterLabels[key]),
      value: key,
    })
  );

  onChange = (option: StateOptionType) => {
    this.props.onChangeState(
      option && option.value ? option.value : FilterOptions.SHOW_ALL
    );
  };

  render() {
    const { intl, isDisabled } = this.props;
    const options = this.filterOptions;

    return (
      <Select
        isClearable
        blurInputOnSelect
        placeholder={intl.formatMessage(messages.filterPlaceholder)}
        options={options}
        isSearchable={false}
        isDisabled={isDisabled}
        styles={styles}
        onChange={this.onChange}
      />
    );
  }
}

export default injectIntl(PullRequestActivityFilter);
