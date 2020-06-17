import React, { PureComponent } from 'react';
import { CopyableTextFieldStateless } from '@atlassian/bitkit-copy';

import { CloneProtocol } from '../types';
import { getCloneCommand } from '../utils/clone-urls';

type CloneUrlProps = {
  isCloneCommandSelected: boolean;
  protocol: CloneProtocol;
  repository?: BB.Repository;
};

export default class CloneUrl extends PureComponent<CloneUrlProps> {
  textField?: HTMLInputElement;

  componentDidMount() {
    this.selectCloneUrl();
  }

  componentDidUpdate() {
    this.selectCloneUrl();
  }

  handleRef = (ref?: HTMLInputElement) => {
    this.textField = ref;
  };

  selectCloneUrl() {
    if (!this.props.isCloneCommandSelected) {
      return;
    }

    if (!this.textField) {
      return;
    }

    this.textField.focus();
    this.textField.select();
  }

  render() {
    const { protocol, repository } = this.props;
    const url = getCloneCommand(protocol, repository);

    return (
      <CopyableTextFieldStateless
        isReadOnly
        forwardedRef={this.handleRef}
        value={url || ''}
      />
    );
  }
}
