import React, { PureComponent } from 'react';
import AkSpinner from '@atlaskit/spinner';

export type IframeLoadingIndicatorProps = {
  containerStyle?: {
    [key: string]: any;
  };
};

export default class IframeLoadingIndicator extends PureComponent<
  IframeLoadingIndicatorProps
> {
  static defaultProps = {
    containerStyle: {
      position: 'relative',
      height: 'auto',
      width: 'auto',
      minHeight: 140,
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };
  render() {
    return (
      <div style={this.props.containerStyle}>
        <AkSpinner size="large" />
      </div>
    );
  }
}
