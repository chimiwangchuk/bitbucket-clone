import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import messages from '../i18n';
import * as styles from '../styles';
import { CloneProtocol } from '../types';

import CloneProtocolSelect from './clone-protocol-select';

type CloneDialogHeaderProps = {
  onProtocolSelected: (protocol: CloneProtocol) => void;
  protocol: CloneProtocol;
};

export default class CloneDialogHeader extends PureComponent<
  CloneDialogHeaderProps
> {
  render() {
    return (
      <styles.CloneDialogHeader>
        <FormattedMessage tagName="h3" {...messages.dialogHeading} />
        <CloneProtocolSelect
          onProtocolSelected={this.props.onProtocolSelected}
          protocol={this.props.protocol}
        />
      </styles.CloneDialogHeader>
    );
  }
}
