import * as React from 'react';
import {
  ConnectModulePrincipalId,
  ConnectModuleRequest,
  ConnectTarget,
  ConnectModule,
} from '@atlassian/bitbucket-connect-js';
import { isArray, getObjectValue } from '../../main/utils';
import Connect, { ConnectProps } from '../../main/connect';
import PCancelable from './pcancelable';

// These props are used by multiple components that extend <ConnectModules/>
// They are can be used to make requests to the Modules API via AddonManager.getModules(...args)
export type ConnectModulesRequestProps = Partial<{
  modules: ConnectModule[]; // if modules is passed, then no API request will me made
  module: ConnectModule; // if a single module is passed, then no API request will me made
  principalId: ConnectModulePrincipalId; // principalId is required if making a request
  moduleType: string; // moduleType is required if making a request
  moduleKey: string; // optional
  moduleId: string; // optional
  location: string; // optional
  targetHref: string; // required if no target
  appKey: string; // optional
  target: ConnectTarget; // required if no targetHref
  query: ConnectModuleRequest[]; // optionally used for complex queries
}>;

export type ConnectModulesChild = (
  state: ConnectModulesState
) => React.ReactNode;

export interface ConnectModulesChildren {
  children?: ConnectModulesChild;
}

export interface ConnectModulesStandardProps {
  cacheResolver?: (props: ConnectModulesProps) => ConnectModule[]; // used to override cache handling of <ConnectModules/>
  onMount?: (state: any) => void;
  onUpdate?: (state: any) => void;
}

export type ConnectModulesProps = ConnectModulesRequestProps &
  ConnectModulesStandardProps &
  ConnectModulesChildren &
  ConnectProps;

export type ConnectModulesState = {
  modules: ConnectModule[];
  loading: boolean;
  error: any;
  principalId?: string;
  target?: any;
};

export class ConnectModules extends React.Component<
  ConnectModulesProps,
  ConnectModulesState
> {
  props: ConnectModulesProps;
  state: ConnectModulesState;
  getModules: PCancelable;
  static defaultProps = {
    options: {},
    cacheResolver: (props: ConnectModulesProps) => {
      if (isArray(props.query) && props.query.length > 0) {
        return props.query.reduce(
          (mods: ConnectModule[], req: ConnectModuleRequest) => {
            return mods.concat(
              props.addonManager.filterModules(
                ...req.modules.map(c => ({
                  ...c,
                  targetHref: getObjectValue(req.target, 'links.self.href', ''),
                }))
              )
            );
          },
          []
        );
      }
      const { moduleId, appKey, moduleKey, moduleType, location } = props;
      return props.addonManager.filterModules({
        moduleId,
        appKey,
        moduleKey,
        moduleType,
        location,
        targetHref: getObjectValue(
          props.target,
          'links.self.href',
          props.targetHref
        ),
      });
    },
  };

  constructor(props: ConnectModulesProps) {
    super(props);
    this.state = {
      modules: [],
      loading: false,
      error: null,
    };
  }

  componentWillMount() {
    this.setup(this.props);
  }

  componentDidMount() {
    this.loadModules(this.props);
    if (typeof this.props.onMount === 'function') {
      this.props.onMount(this.state);
    }
  }

  componentWillReceiveProps(nextProps: ConnectModulesProps) {
    this.setup(nextProps);
  }

  shouldComponentUpdate(
    nextProps: ConnectModulesProps,
    nextState: ConnectModulesState
  ) {
    if (
      // check props
      this.props.principalId === nextProps.principalId &&
      this.props.moduleType === nextProps.moduleType &&
      this.props.moduleKey === nextProps.moduleKey &&
      this.props.moduleId === nextProps.moduleId &&
      this.props.location === nextProps.location &&
      this.props.targetHref === nextProps.targetHref &&
      this.props.appKey === nextProps.appKey &&
      this.props.target === nextProps.target &&
      this.props.query === nextProps.query &&
      // check state
      this.state.loading === nextState.loading &&
      this.state.principalId === nextState.principalId &&
      this.state.error === nextState.error &&
      this.state.principalId === nextState.principalId &&
      this.state.modules.length === nextState.modules.length &&
      this.state.modules.every((val, index) => val === nextState.modules[index])
    ) {
      const cachedModules =
        nextProps.cacheResolver && nextProps.cacheResolver(nextProps);
      return !isArray(cachedModules) || cachedModules.length <= 0;
    }
    return true;
  }

  componentWillUnmount() {
    if (this.getModules) {
      this.getModules.cancel();
    }
  }

  loadModules = (connectProps: ConnectModulesProps) => {
    if (!this.state.loading) {
      return;
    }
    const {
      query,
      moduleType,
      moduleKey,
      moduleId,
      location,
      targetHref,
      appKey,
    } = connectProps;
    const { principalId, target } = this.state;
    if (!principalId) {
      return;
    }
    const requests = query || [
      {
        target,
        modules: [
          {
            moduleType,
            moduleKey,
            moduleId,
            location,
            targetHref,
            appKey,
          },
        ],
      },
    ];

    this.getModules = new PCancelable((_, resolve, reject) => {
      connectProps.addonManager
        .getModules(principalId, ...requests)
        .then(resolve)
        .catch(reject);
    });

    this.getModules
      .then(modules => {
        this.setState({ modules, loading: false });
      })
      // @ts-ignore TODO: fix noImplicitAny error here
      .catch(error => {
        if (this.getModules && this.getModules.canceled) {
          return;
        }
        this.setState({ error, loading: false });
      });
  };

  setup = (connectProps: ConnectModulesProps) => {
    const { addonManager, module: mod, modules = [] } = connectProps;
    if (mod) {
      this.setState({ loading: false, modules: [mod] });
      return;
    }
    if (isArray(modules) && modules.length) {
      this.setState({ loading: false, modules });
      return;
    }

    const cachedModules =
      connectProps.cacheResolver && connectProps.cacheResolver(connectProps);
    if (isArray(cachedModules) && cachedModules.length) {
      this.setState({ loading: false, modules: cachedModules });
      return;
    }

    const { targetHref } = connectProps;
    let { principalId, target } = connectProps;
    // if this module has expired, we need to call the modules API to fetch new data
    // we do this by attaching the target from cache to the request
    if (!target && targetHref && addonManager.targets.has(targetHref)) {
      const tar = addonManager.targets.get(targetHref);
      if (tar) {
        /* eslint-disable prefer-destructuring */
        principalId = tar.principalId;
        target = tar.target;
        /* eslint-enable prefer-destructuring */
      }
    }

    this.setState({ loading: true, principalId, target });
  };

  // eslint-disable-next-line react/sort-comp
  componentDidUpdate() {
    this.loadModules(this.props);
    if (typeof this.props.onUpdate === 'function') {
      this.props.onUpdate(this.state);
    }
  }

  render() {
    if (typeof this.props.children === 'function') {
      return this.props.children(this.state);
    }
    return null;
  }
}

export default Connect(ConnectModules);
