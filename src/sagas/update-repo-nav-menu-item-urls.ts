import { take, put, select } from 'redux-saga/effects';
import { getMenuItems } from 'src/selectors/repository-selectors';

import { MenuItem, mapNestedMenuItems } from '@atlassian/bitbucket-navigation';
import {
  UPDATE_MENU_ITEM_URLS_REPO_NAME,
  UPDATE_REPOSITORY_SECTION_MENU_ITEMS,
} from 'src/sections/repository/actions';

export default function* updateMenuItemUrls() {
  while (true) {
    const {
      payload: { oldRepoSlug, newRepoSlug },
    } = yield take(UPDATE_MENU_ITEM_URLS_REPO_NAME);
    const repoNavMenuItems = yield select(getMenuItems);

    if (!oldRepoSlug || !newRepoSlug || !Array.isArray(repoNavMenuItems)) {
      return false;
    }

    const matchRegex = new RegExp(`^/(.+?)/(${oldRepoSlug})/`);

    const updatedMenuItems = mapNestedMenuItems(repoNavMenuItems, item => {
      if (item.url) {
        return {
          ...item,
          url: item.url.replace(matchRegex, `/$1/${newRepoSlug}/`),
        };
      }
      return item;
    }) as MenuItem[];

    yield put({
      type: UPDATE_REPOSITORY_SECTION_MENU_ITEMS,
      payload: updatedMenuItems,
    });
  }
}
