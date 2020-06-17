import React from 'react';

import CreateBranch from '../components/create-branch-dialog';
import { CREATE_FROM } from '../constants';
import connect from './connect';

export default connect(props => (
  <CreateBranch
    {...props}
    createFrom={CREATE_FROM.GLOBAL_DIALOG}
    shouldRenderCreateBranchButton={false}
  />
));
