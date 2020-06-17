import React, { PureComponent } from 'react';
// @ts-ignore TODO: fix noImplicitAny error here
import Select from '@atlaskit/select';

import { CloneProtocol } from '../types';

type CloneProtocolSelectProps = {
  onProtocolSelected: (protocol: CloneProtocol) => void;
  protocol: CloneProtocol;
};

type CloneProtocolSelectState = {
  isOpen: boolean;
};

const protocolItems = ['https', 'ssh'].map(protocol => ({
  value: protocol,
  label: protocol.toUpperCase(),
}));

// @ts-ignore TODO: fix noImplicitAny error here
const getProtocolItem = protocol =>
  protocolItems.find(item => item.value === protocol);

export default class CloneProtocolSelect extends PureComponent<
  CloneProtocolSelectProps,
  CloneProtocolSelectState
> {
  static defaultProps = {
    protocol: 'https',
    onProtocolSelected: () => {},
  };

  state = {
    isOpen: false,
  };

  render() {
    return (
      <Select
        isSearchable={false}
        hideSelectedOptions
        menuIsOpen={this.state.isOpen}
        options={protocolItems}
        onMenuOpen={() => this.setState({ isOpen: true })}
        onMenuClose={() => this.setState({ isOpen: false })}
        value={getProtocolItem(this.props.protocol)}
        // @ts-ignore TODO: fix noImplicitAny error here
        onChange={(item, { action }) => {
          if (action !== 'select-option') {
            return;
          }
          if (item && 'value' in item) {
            this.props.onProtocolSelected(item.value as CloneProtocol);
          }
        }}
        // min width to prevent truncating the protocol options
        styles={{
          // @ts-ignore TODO: fix noImplicitAny error here
          container: containerStyles => ({
            ...containerStyles,
            minWidth: '5.5rem',
          }),
        }}
      />
    );
  }
}
