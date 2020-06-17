import Tooltip from '@atlaskit/tooltip';
import React, { PureComponent } from 'react';

import * as styles from './ref-branch.styled';

type Props = {
  /** The name of the branch. */
  name: string;
  isFluidWidth?: boolean;
};

export default class RefBranch extends PureComponent<Props> {
  render() {
    return (
      <Tooltip content={this.props.name} position="top">
        <styles.BranchText isFluidWidth={!!this.props.isFluidWidth}>
          {this.props.name}
        </styles.BranchText>
      </Tooltip>
    );
  }
}
