import { schema } from 'normalizr';

import { user } from 'src/sections/profile/schemas';

export const project = new schema.Entity(
  'projects',
  {},
  { idAttribute: 'uuid' }
);

export const repository = new schema.Entity(
  'repositories',
  {
    owner: user,
    project,
  },
  { idAttribute: 'uuid' }
);
