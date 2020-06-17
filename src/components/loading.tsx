import Spinner from '@atlaskit/spinner';
import React, { PureComponent } from 'react';

import { CenteredRow } from 'src/styles';

type LoadingProps = {
  className?: string;
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | number;
};

export default class Loading extends PureComponent<LoadingProps> {
  render() {
    const { className, ...spinnerProps } = this.props;

    return (
      <CenteredRow className={className}>
        <Spinner size="small" {...spinnerProps} />
      </CenteredRow>
    );
  }
}
