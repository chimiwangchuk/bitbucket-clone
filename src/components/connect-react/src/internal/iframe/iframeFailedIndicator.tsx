import React, { PureComponent } from 'react';

export default class IframeFailedIndicator extends PureComponent<any> {
  render() {
    const { appKey, width, height } = this.props;
    return (
      <div style={{ width, height }}>
        <p>Oops, the app {appKey} failed to load.</p>
      </div>
    );
  }
}
