import { PureComponent, ReactNode } from 'react';
import { connect } from 'react-redux';
import { getSourceRepositoryAccessLevel } from 'src/redux/pull-request/selectors';
import { RepositoryPrivilege } from 'src/sections/repository/types';
import { getRepositoryAccessLevel } from 'src/selectors/repository-selectors';
import { BucketState } from 'src/types/state';
import { checkUserAccess } from '../utils/check-user-access';

type Props = {
  children: ReactNode;
  userLevel: RepositoryPrivilege | null | undefined;
  userSourceRepositoryAccessLevel?: RepositoryPrivilege | null | undefined;
  requiredLevel: RepositoryPrivilege;
};

export class AccessGuard extends PureComponent<Props> {
  render() {
    const {
      userLevel,
      userSourceRepositoryAccessLevel,
      requiredLevel,
      children,
    } = this.props;

    let userHasAccess = checkUserAccess({
      userLevel,
      requiredLevel,
    });

    if (userSourceRepositoryAccessLevel && !userHasAccess) {
      userHasAccess = checkUserAccess({
        userLevel: userSourceRepositoryAccessLevel,
        requiredLevel,
      });
    }

    return userHasAccess ? children : null;
  }
}

const mapStateToProps = (state: BucketState) => ({
  userLevel: getRepositoryAccessLevel(state),
  userSourceRepositoryAccessLevel: getSourceRepositoryAccessLevel(state),
});

const ConnectedRepositoryAccessGuard = connect(mapStateToProps)(AccessGuard);

export default ConnectedRepositoryAccessGuard;
