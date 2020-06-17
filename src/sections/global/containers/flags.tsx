import { FlagGroup } from '@atlaskit/flag';
import * as Sentry from '@sentry/browser';
import React, { ComponentType, PureComponent } from 'react';
import { connect } from 'react-redux';

import { dismissFlag } from 'src/redux/flags';
import {
  ComponentFlagId,
  ComponentFlagProps,
  FlagObject,
} from 'src/redux/flags/types';
import { CreateBranchSuccessFlag } from 'src/sections/global/components/flags/create-branch/create-branch-success-flag';
import {
  CreateBranchErrorFlag,
  LoadRepositoriesErrorFlag,
} from 'src/sections/global/components/flags/create-branch/create-branch-error-flag';
import { publishFact } from 'src/utils/analytics/publish';
import CommitsListUpdatedFlag from 'src/sections/global/components/flags/commits-list-updated';
import { BucketState } from 'src/types/state';
import IeDeprecationFlagTwo from '../components/flags/ie-deprecation/ie-deprecation-flag-two';
import {
  AccountCreatedFlag,
  RepositoryCreatedFlag,
  FileCreatedFlag,
} from '../components/flags/celebration';
import { PullRequestUpdatedFlag } from '../components/flags/pull-request-updated-flag';
import OutdatedJIRAConnectorFlag from '../components/flags/outdated-jira-connector-flag';
import MarketingConsent from '../components/flags/marketing-consent/marketing-consent-flag';
import SimpleFlag from '../components/flags/simple/simple-flag';
import SiteMessage from '../components/flags/site-message/site-message-flag';
import { DeleteBranchSuccessFlag } from '../components/flags/delete-branch/delete-branch-success-flag';
import { DeleteBranchErrorFlag } from '../components/flags/delete-branch/delete-branch-error-flag';
import { CompareBranchesSuccessFlag } from '../components/flags/compare-branches/compare-branches-success-flag';
import { CompareBranchesErrorFlag } from '../components/flags/compare-branches/compare-branches-error-flag';
import { CompareBranchesTimeoutFlag } from '../components/flags/compare-branches/compare-branches-timeout-flag';
import CreateWorkspaceErrorFlag from '../components/flags/create-workspace/create-workspace-error-flag';
import { RevertPullRequestErrorFlag } from '../components/flags/revert-pull-request/revert-pull-request-error-flag';
import OfflineFlag from '../components/flags/offline/offline';
import OnlineFlag from '../components/flags/offline/online';
import { PullRequestPreferencesErrorFlag } from '../components/flags/pull-request-preferences-error-flag';
import DeleteRepositorySuccessFlag from '../components/flags/delete-repository/delete-repository-success-flag';
import { FlagDismissed } from '../facts';
import MegaLaunchFlag from '../components/flags/mega-launch/mega-launch-flag';

const flagRegistry: {
  [key in ComponentFlagId]: ComponentType<ComponentFlagProps>;
} = {
  'celebrate-account-created': AccountCreatedFlag,
  'celebrate-repository-created': RepositoryCreatedFlag,
  'celebrate-file-created': FileCreatedFlag,
  'create-branch-load-repositories-error': LoadRepositoriesErrorFlag,
  'create-branch-success': CreateBranchSuccessFlag,
  'create-branch-error': CreateBranchErrorFlag,
  'create-workspace-error': CreateWorkspaceErrorFlag,
  'delete-branch-success': DeleteBranchSuccessFlag,
  'delete-branch-error': DeleteBranchErrorFlag,
  'compare-branches-success': CompareBranchesSuccessFlag,
  'compare-branches-error': CompareBranchesErrorFlag,
  'compare-branches-timeout': CompareBranchesTimeoutFlag,
  'marketing-consent': MarketingConsent,
  'site-message': SiteMessage,
  'pull-request-preferences-error': PullRequestPreferencesErrorFlag,
  'pull-request-updated': PullRequestUpdatedFlag,
  'commits-list-updated': CommitsListUpdatedFlag,
  'network-offline': OfflineFlag,
  'network-online': OnlineFlag,
  'revert-pull-request-error': RevertPullRequestErrorFlag,
  'outdated-jira-connector-flag': OutdatedJIRAConnectorFlag,
  'delete-repository-success': DeleteRepositorySuccessFlag,
  'ie-deprecation-flag-two': IeDeprecationFlagTwo,
  'mega-launch-flag': MegaLaunchFlag,
};

const mapDispatchToProps = {
  dismissFlag,
};

const mapStateToProps = (state: BucketState) => ({
  flags: state.flags,
});

type Props = {
  dismissFlag: (flagId: string | ComponentFlagId) => void;
  flags: FlagObject[];
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class extends PureComponent<Props> {
    handleDismissed = (id: string) => {
      const { flags } = this.props;
      const flag = flags.find(f => f.id === id);

      if (!flag) {
        return;
      }

      publishFact(new FlagDismissed({ flag_id: flag.id }));

      this.props.dismissFlag(flag.id);
    };

    renderFlag = (flagObj: FlagObject) => {
      if (flagObj.type === 'component') {
        const FlagComponent = flagRegistry[flagObj.id];
        if (!FlagComponent) {
          Sentry.withScope(scope => {
            scope.setTag('flagId', flagObj.id);
            Sentry.captureMessage('UNKNOWN_FLAG');
          });

          // eslint-disable-next-line no-console
          console.warn(`UNKNOWN_FLAG: ${flagObj.id}`);
          return null;
        }

        return <FlagComponent id={flagObj.id} key={flagObj.id} />;
      }

      return <SimpleFlag {...flagObj} key={flagObj.id} />;
    };

    render() {
      const { flags } = this.props;
      return (
        <FlagGroup onDismissed={this.handleDismissed}>
          {flags.map(this.renderFlag).filter(f => f !== null)}
        </FlagGroup>
      );
    }
  }
);
