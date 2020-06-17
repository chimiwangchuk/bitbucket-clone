import createReducer from 'src/utils/create-reducer';
import {
  FetchOwners,
  CLEAR_FILTERED_OWNERS,
  SELECT_OWNER,
  FetchAndSelectOwner,
} from 'src/redux/dashboard/actions/fetch-repository-owners';
import { User } from 'src/components/types';
import { Owner } from 'src/sections/dashboard/types';

export type OwnersFilterState = {
  isLoading: boolean;
  isError: boolean;
  owners: Owner[];
  selectedOwner: Owner | null;
};

const initialState: OwnersFilterState = {
  isLoading: false,
  isError: false,
  owners: [],
  selectedOwner: null,
};

export default createReducer(initialState, {
  [FetchOwners.REQUEST](state) {
    return {
      ...state,
      isLoading: true,
    };
  },

  [FetchOwners.ERROR](state) {
    return {
      ...state,
      isLoading: false,
      isError: true,
    };
  },

  [FetchOwners.SUCCESS](state, action) {
    return {
      ...state,
      isLoading: false,
      owners: action.payload,
    };
  },

  [CLEAR_FILTERED_OWNERS](state) {
    return {
      ...state,
      isLoading: false,
      owners: [],
    };
  },

  [FetchAndSelectOwner.REQUEST](state) {
    return {
      ...state,
      isLoading: true,
    };
  },

  [FetchAndSelectOwner.ERROR](state) {
    return {
      ...state,
      isLoading: false,
      isError: true,
    };
  },

  [FetchAndSelectOwner.SUCCESS](state, action) {
    const user: User = action.payload;
    // eslint-disable-next-line @typescript-eslint/camelcase
    const { display_name, nickname, uuid, links } = user;
    const avatarUrl = links.avatar.href;

    return {
      ...state,
      isLoading: false,
      selectedOwner: { display_name, nickname, uuid, avatar_url: avatarUrl },
    };
  },

  [SELECT_OWNER](state, action) {
    return {
      ...state,
      selectedOwner: action.payload,
    };
  },
});
