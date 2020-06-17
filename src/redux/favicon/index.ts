import { createSelector } from 'reselect';

import defaultIcon from 'src/components/favicon/build-favicon-default.ico';
import { BucketState, Action } from 'src/types/state';

const UPDATE_FAVICON = 'favicon/UPDATE';

const initialState = {
  url: defaultIcon,
};

export type FaviconState = typeof initialState;

export const updateFavicon = (url: string) => ({
  type: UPDATE_FAVICON,
  payload: { url },
});

export const clearFavicon = () => ({
  type: UPDATE_FAVICON,
  payload: { url: defaultIcon },
});

export const getFaviconUrl = createSelector(
  (state: BucketState) => state.favicon,
  state => state.url
);

export default (state: FaviconState = initialState, action: Action) => {
  switch (action.type) {
    case UPDATE_FAVICON: {
      const { url } = action.payload;

      return {
        ...state,
        url,
      };
    }

    default:
      return state;
  }
};
