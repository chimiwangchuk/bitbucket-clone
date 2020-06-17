import { BuildStatus } from 'src/components/types';
import { UPDATE_BUILDS } from './constants';

export default (builds: BuildStatus[]) => ({
  type: UPDATE_BUILDS,
  payload: builds,
});
