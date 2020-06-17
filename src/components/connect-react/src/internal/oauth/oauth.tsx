import * as React from 'react';
import { FlagGroup } from '@atlaskit/flag';
import { ModalTransition } from '@atlaskit/modal-dialog';
import OAuthFlag from './flag';
import OAuthErrorFlag from './error';
import OAuthModalDialog from './modal';
import {
  OAuthModule,
  OAuthModulePartial,
  OAuthScope,
  OAuthAcceptOrDenyOptions,
} from './types';

type OAuthProps = {
  addonManager: any;
};

type OAuthState = {
  flags: OAuthModule[];
  scopes: OAuthScope[];
  hasError: boolean;
  modalDialog?: OAuthModule;
};

const emptyFlag = {
  moduleId: '',
  name: '',
  scopes: '',
  accept: () => {},
  deny: () => {},
};

const addFlagToGroup = (
  flags: OAuthModule[],
  ...flagProps: Array<OAuthModulePartial | boolean>
): OAuthModule[] => {
  // eslint-disable-next-line no-param-reassign
  flags = flags.slice();
  flags.unshift(
    flagProps.reduce<OAuthModule>(
      (obj: OAuthModule, props: OAuthModulePartial | boolean) =>
        typeof props === 'object' ? { ...obj, ...props } : obj,
      { ...emptyFlag }
    )
  );
  return flags;
};

export class OAuth extends React.PureComponent<OAuthProps, OAuthState> {
  unlisten: Function;
  state: OAuthState = {
    flags: [],
    scopes: [],
    hasError: false,
  };

  componentDidMount() {
    // setup listener for auth requests
    this.unlisten = this.props.addonManager.handleOAuthAcceptOrDeny(
      (opts: OAuthAcceptOrDenyOptions, accept: Function, deny: Function) => {
        this.props.addonManager.getOAuthScopes(
          (scopes: OAuthScope[]) => {
            // If request to getScopes() is successful, show the accept/deny flag
            this.setState(state => ({
              scopes,
              flags: addFlagToGroup(state.flags, opts, {
                accept: () => this.onAcceptOrDeny(opts.moduleId, true, accept),
                deny: () => this.onAcceptOrDeny(opts.moduleId, false, deny),
              }),
            }));
          },
          () => {
            // If request to getScopes() fails, then call deny handler
            // and then handler the error
            this.setState({ hasError: true });
            deny();
          }
        );
      }
    );
    // This will be called after the user accepts the oauth request and the AddonManager.getToken() completes
    // It is called on both successful (isAccepted=true) and failed requests (isAccepted=false)
    this.props.addonManager.setGrantOAuthHandler(
      (opts: OAuthAcceptOrDenyOptions, isAccepted: boolean) => {
        this.addFlag(
          opts,
          {
            deny: () => this.removeFlag(opts.moduleId),
          },
          isAccepted && { denied: false },
          !isAccepted && { hasError: true }
        );
      }
    );
  }

  componentWillUnmount() {
    if (typeof this.unlisten === 'function') {
      this.unlisten();
    }
    this.props.addonManager.setGrantOAuthHandler(null);
  }

  addFlag = (...flagProps: Array<OAuthModulePartial | boolean>) =>
    this.setState(state => ({
      flags: addFlagToGroup(state.flags, ...flagProps),
    }));

  dismissErrorFlag = () => this.setState({ hasError: false });

  removeFlag = (moduleId: string) => {
    let flags = this.state.flags.slice();
    flags = flags.filter(({ moduleId: id }) => moduleId !== id);
    this.setState({ flags, modalDialog: undefined });
  };

  onAcceptOrDeny = (
    moduleId: string,
    isAccepted: boolean,
    callback: Function
  ) => {
    const flag = this.state.flags.find(({ moduleId: id }) => moduleId === id);
    if (!flag) {
      return;
    }
    const removeFlag = () => this.removeFlag(moduleId);
    removeFlag();
    if (!isAccepted) {
      this.props.addonManager.denyOAuthConsumer(
        moduleId,
        () => this.addFlag(flag, { deny: removeFlag, denied: true }), // onSuccess
        () =>
          this.addFlag(flag, { deny: removeFlag, denied: true, hasError: true }) // onFailed
      );
    }
    callback();
  };

  showModalDialog = (mod: OAuthModule) => {
    this.setState({ modalDialog: mod });
  };

  render() {
    const { flags, scopes, hasError, modalDialog } = this.state;
    return (
      <React.Fragment>
        <ModalTransition>
          {modalDialog && (
            <OAuthModalDialog scopes={scopes} module={modalDialog} />
          )}
        </ModalTransition>
        <FlagGroup>
          {hasError ? (
            <OAuthErrorFlag key="oauth-error" dismiss={this.dismissErrorFlag} />
          ) : (
            flags.map(mod => (
              <OAuthFlag
                key={mod.moduleId}
                module={mod}
                scopes={scopes}
                showModalDialog={() => this.showModalDialog(mod)}
                managePermissionsUrl={this.props.addonManager.getManagePermissionsUrl()}
              />
            ))
          )}
        </FlagGroup>
      </React.Fragment>
    );
  }
}

export default OAuth;
