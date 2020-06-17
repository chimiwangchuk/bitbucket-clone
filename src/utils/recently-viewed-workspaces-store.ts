import { User } from 'src/components/types';
import store from 'src/utils/store';

const storageName = (user: User) =>
  `recently-viewed-workspace-uuids:${user.uuid}`;

function set(user: User, workspaceUuids: string[]) {
  if (store.enabled) {
    store.set(storageName(user), workspaceUuids);
  }
}

function get(user: User): string[] {
  if (!store.enabled) {
    return [];
  }
  return store.get(storageName(user)) || [];
}

export default { get, set };
