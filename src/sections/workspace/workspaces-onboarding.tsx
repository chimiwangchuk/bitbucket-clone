import React from 'react';
import { connect } from 'react-redux';
import { BucketState } from 'src/types/state';
import { hiddenLoadable } from 'src/utils/loadable-configs';
import { getCurrentUser } from 'src/selectors/user-selectors';
import { User } from 'src/components/types';

const mapStateToProps = (state: BucketState) => ({
  workspacesEnabled: state.global.features['workspace-ui'],
  prereleaseEnabled: state.global.features['workspaces-prerelease'],
  onboardingEnabled: state.global.features['workspaces-onboarding'],
  currentUser: getCurrentUser(state),
});

type Props = {
  workspacesEnabled?: boolean;
  prereleaseEnabled?: boolean;
  onboardingEnabled?: boolean;
  currentUser?: User;
};

const WorkspacesOnboarding = hiddenLoadable(() =>
  import(
    /* webpackChunkName: "workspaces-onboarding" */ 'src/components/onboarding/workspaces/onboarding'
  )
);

const WorkspacesPrerelease = hiddenLoadable(() =>
  import(
    /* webpackChunkName: "workspaces-prerelease" */ 'src/components/onboarding/workspaces/prerelease'
  )
);

export class OnboardWorkspaces extends React.PureComponent<Props> {
  static WORKSPACES_LAUNCH_DATE = new Date('2020-04-15T07:00:00Z');
  static isPreWorkspacesUser(user: User) {
    return (
      user.created_on &&
      new Date(user.created_on) < OnboardWorkspaces.WORKSPACES_LAUNCH_DATE
    );
  }
  render() {
    const {
      workspacesEnabled,
      prereleaseEnabled,
      onboardingEnabled,
      currentUser,
    } = this.props;
    return (
      <>
        {!workspacesEnabled && prereleaseEnabled && currentUser && (
          <WorkspacesPrerelease />
        )}
        {workspacesEnabled &&
          onboardingEnabled &&
          currentUser &&
          OnboardWorkspaces.isPreWorkspacesUser(currentUser) && (
            <WorkspacesOnboarding />
          )}
      </>
    );
  }
}

export default connect(mapStateToProps)(OnboardWorkspaces);
