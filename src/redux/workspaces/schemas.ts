import { schema } from 'normalizr';

export const workspace = new schema.Entity(
  'workspaces.uuid',
  {},
  { idAttribute: 'uuid' }
);
