import { fetchAction } from 'src/redux/actions';

import urls from '../urls';

// @ts-ignore TODO: fix noImplicitAny error here
export default (action, repositoryFullName: string, branchName: string) => {
  const [owner, slug] = repositoryFullName.split('/');

  return fetchAction(action, {
    url: `${urls.api.v20.branch(owner, slug, branchName)}`,
  });
};
