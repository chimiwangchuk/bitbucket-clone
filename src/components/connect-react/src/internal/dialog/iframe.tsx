import React, { PureComponent, Fragment } from 'react';
import { ConnectIframe } from '../iframe/connectIframe';

class DialogIframeContainer extends PureComponent {
  render() {
    return <Fragment>{this.props.children}</Fragment>;
  }
}

export default class DialogIframe extends PureComponent<any> {
  static defaultProps = {
    defaultStyles: { flex: 1 },
    iframeContainer: DialogIframeContainer,
  };
  render() {
    const {
      connectHost,
      addonManager,
      extension,
      width,
      height,
      defaultStyles,
      iframeContainer,
    } = this.props;

    const appKey = extension.appKey || extension.addon_key;
    const moduleKey = extension.moduleKey || extension.key;
    let { targetHref } = extension;
    if (!targetHref) {
      const addons = addonManager.findModules({ appKey, moduleKey });
      if (addons.length) {
        // eslint-disable-next-line prefer-destructuring
        targetHref = addons[0].targetHref;
      }
    }

    return (
      <ConnectIframe
        {...extension}
        moduleKey={moduleKey}
        appKey={appKey}
        targetHref={targetHref}
        width={width}
        height={height}
        options={{
          ...extension.options,
          isDialogModule: true,
        }}
        defaultStyles={defaultStyles}
        iframeContainer={iframeContainer}
        connectHost={connectHost}
        addonManager={addonManager}
      />
    );
  }
}
