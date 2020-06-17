import { hydrateAction } from 'src/redux/actions';

import { repository } from '../schemas';

import { LoadRepositoryPage } from './';

const stateKey = ['repository.section', 'section.repository'];
export default (repositoryFullSlug: string) =>
  hydrateAction(LoadRepositoryPage, stateKey, {
    url: `/${repositoryFullSlug}`,
    schema: {
      currentRepository: repository,
    },
  });
