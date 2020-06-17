import React from 'react';
import { connect } from 'react-redux';
import { CloneModalDialog } from '@atlassian/bitkit-clone-controls';

import {
  getCurrentRepository,
  getRepositorySourceTreeHasXcode,
} from 'src/selectors/repository-selectors';
import {
  getCurrentUser,
  getCurrentUserDefaultCloneProtocol,
} from 'src/selectors/user-selectors';
import { BucketState, BucketDispatch } from 'src/types/state';
import { publishFact } from 'src/utils/analytics/publish';

import MirrorCloneControls from '../containers/mirror-clone-controls';
import toggleCloneDialog from '../actions/toggle-clone-dialog';
import { RepoCloneClientClicked } from '../facts';

const mapStateToProps = (state: BucketState) => {
  const user = getCurrentUser(state);
  return {
    defaultProtocol: getCurrentUserDefaultCloneProtocol(state),
    isOpen: state.repository.section.isCloneDialogOpen,
    repository: getCurrentRepository(state),
    user,
    xcode: getRepositorySourceTreeHasXcode(state),
  };
};

const mapDispatchToProps = (dispatch: BucketDispatch) => ({
  onDialogDismissed: () => dispatch(toggleCloneDialog(false)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(props => (
  <CloneModalDialog
    {...props}
    onCloneClient={(client: 'Sourcetree' | 'Xcode') =>
      publishFact(new RepoCloneClientClicked({ client }))
    }
  >
    <MirrorCloneControls {...props} />
  </CloneModalDialog>
));
