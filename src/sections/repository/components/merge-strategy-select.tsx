import React, { Component } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
// @ts-ignore TODO: fix noImplicitAny error here
import Select, { components } from '@atlaskit/select';
import { Label } from '@atlaskit/field-base';
import {
  getMergeStrategyOption,
  MergeStrategyOption,
} from 'src/sections/repository/utils/merge-strategies';
import { getModalMenuPortalStyles } from 'src/styles/select';
import { MergeStrategy } from 'src/types/pull-request';
import messages from './merge-strategy-select.i18n';

type MergedStrategySelectProps = {
  isDisabled?: boolean;
  mergeStrategies: MergeStrategy[];
  value?: MergeStrategyOption;
  defaultValue?: MergeStrategyOption;
  onChange: any;
  intl: InjectedIntl;
  isBannerOpen: boolean;
};

class MergeStrategySelect extends Component<MergedStrategySelectProps> {
  static defaultProps = {
    isDisabled: false,
  };

  // @ts-ignore TODO: fix noImplicitAny error here
  formatOption = props => (
    <components.Option {...props}>
      <div>{props.data.label}</div>
      <div>{props.data.description}</div>
    </components.Option>
  );

  getMergeStrategies = () => {
    const { intl, mergeStrategies } = this.props;

    return mergeStrategies.map(strategy =>
      getMergeStrategyOption(strategy, intl)
    );
  };

  render() {
    const { intl, isBannerOpen } = this.props;

    const styles = getModalMenuPortalStyles(isBannerOpen);

    return (
      <div>
        <Label label={intl.formatMessage(messages.mergeStrategyLabel)} />
        <Select
          isSearchable={false}
          menuPortalTarget={document.body}
          isDisabled={this.props.isDisabled}
          options={this.getMergeStrategies()}
          defaultValue={this.props.defaultValue}
          value={this.props.value}
          onChange={this.props.onChange}
          styles={styles}
          components={{ Option: this.formatOption }}
          menuPlacement="auto"
        />
      </div>
    );
  }
}

export default injectIntl(MergeStrategySelect);
