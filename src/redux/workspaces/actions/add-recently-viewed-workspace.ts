import { Workspace } from 'src/components/types';
import { workspace as workspaceSchema } from '../schemas';
import { ADD_RECENTLY_VIEWED_WORKSPACE } from './constants';

export default (workspace: Workspace) => ({
  type: ADD_RECENTLY_VIEWED_WORKSPACE,
  payload: workspace,
  meta: {
    schema: workspaceSchema,
  },
});
