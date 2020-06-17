import { zipObject } from 'lodash-es';
import { createAsyncAction } from 'src/redux/actions';

const PREFIX = 'pullrequest/';

// Any entry added here will get a string built be used as an Action type
// and autocomplete assistance from the default export of this module
const ACTIONS = {
  UPDATE_COMMITS: '',
  FETCH_COMMITS: '',
  FETCH_MORE_COMMITS: '',
  RETRY_COMMITS: '',
  COMMIT_FETCH_ERROR: '',
};

export const UPDATE_COMMITS_STATUS = createAsyncAction(
  `${PREFIX}UPDATE_COMMITS_STATUS`
);

type ActionMap = { [key in ActionTypes]: string };
type ActionTypes = keyof typeof ACTIONS;

type Options = {
  prefix?: string;
};

function makeActions(actions: ActionMap, opts: Options): ActionMap {
  const prefixed = Object.keys(actions).map(
    action => `${opts.prefix}${action}`
  );
  // Lodash tries to type as a string Dictionary, this casting keeps our autocomplete
  return zipObject(Object.keys(actions), prefixed) as ActionMap;
}

const preparedActions = makeActions(ACTIONS, { prefix: PREFIX });

/** import Actions... then Actions. should autocomplete the action types */
export default preparedActions;
