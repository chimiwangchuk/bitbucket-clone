import { schema } from 'normalizr';
import { omit } from 'lodash-es';

export const branch = new schema.Entity(
  'branches',
  {},
  {
    idAttribute: entity => entity.links.self.href,
    processStrategy: entity => {
      return omit(
        {
          ...entity,
          isMainBranch: entity.ismainbranch,
          pullRequests: entity.pullrequests,
          commitStatuses: entity.statuses,
        },
        ['statuses', 'pullrequests', 'ismainbranch']
      );
    },
  }
);

branch.define({});
