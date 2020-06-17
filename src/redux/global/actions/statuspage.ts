import { StatuspageIncident } from 'src/types/statuspage';
import { createAsyncAction } from 'src/redux/actions';

export const STOP_STATUSPAGE_POLLING = 'global/STOP_STATUSPAGE_POLLING';
export const START_STATUSPAGE_POLLING = 'global/START_STATUSPAGE_POLLING';

const prefixed = (action: string) => `global/${action}`;

export const LOAD_STATUSPAGE_INCIDENTS = createAsyncAction(
  prefixed('LOAD_STATUSPAGE_INCIDENTS')
);

export type LoadStatuspageIncidentsAction = {
  type: string;
  payload: object[];
};

export const LoadStatusPageIncidentsSuccess = (
  incidents: StatuspageIncident[]
) => ({
  type: LOAD_STATUSPAGE_INCIDENTS.SUCCESS,
  payload: incidents,
});

export const LoadStatusPageIncidentsError = (error: string) => ({
  type: LOAD_STATUSPAGE_INCIDENTS.ERROR,
  error,
});
