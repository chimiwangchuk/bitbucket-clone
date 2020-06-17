import React, { PureComponent, ComponentType } from 'react';
import AkSpinner from '@atlaskit/spinner';
import AkButton from '@atlaskit/button';

export type IframeTimeoutIndicatorProps = {
  containerStyle?: {
    [key: string]: any;
  };
  failedCallback?: (e: React.MouseEvent) => void;
};

export type LoadingTimeoutComponent = ComponentType<
  IframeTimeoutIndicatorProps
>;

export class IframeTimeoutIndicator extends PureComponent<
  IframeTimeoutIndicatorProps
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
        <div>
          Wait or{' '}
          <AkButton appearance="link" onClick={this.props.failedCallback}>
            cancel
          </AkButton>
          ?
        </div>
      </div>
    );
  }
}

export default IframeTimeoutIndicator;
