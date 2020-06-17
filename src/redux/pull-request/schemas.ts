import { schema } from 'normalizr';

import { user } from 'src/sections/profile/schemas';
import { repository } from 'src/sections/repository/schemas';

export const pullRequest = new schema.Entity(
  'pullRequests',
  // @ts-ignore
  {
    author: user,
    closed_by: user,
    destination: { repository },
    participants: [{ user }],
    reviewers: [user],
    source: { repository },
  },
  {
    idAttribute: entity => entity.links.self.href,
  }
);

export const commit = new schema.Entity(
  'commits',
  // @ts-ignore
  {
    author: { user },
    participants: [{ user }],
    repository,
  },
  {
    idAttribute: entity => entity.hash,
  }
);

export const task = new schema.Entity('tasks', {
  creator: user,
});

export const commentLikes = new schema.Entity(
  'commentLikes',
  {
    users: [user],
  },
  { idAttribute: entity => entity.commentId }
);
