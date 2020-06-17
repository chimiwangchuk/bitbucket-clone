import { select, call, put } from 'redux-saga/effects';
import { Selector } from 'reselect';
import authRequest from 'src/utils/fetch';
import urls from 'src/urls/dashboard';
import { repository as repositorySchema } from 'src/sections/repository/schemas';
import { Repository } from 'src/components/types';
import { BuildStatusesMap } from 'src/types';
import { AsyncAction } from 'src/redux/actions';

export type RepositoryBuildStatus = {
  links: {
    builds: {
      href: string;
    };
  };
  repository: Repository;
  status_counts?: BuildStatusesMap;
  type: 'computed_build';
};

export const addStatuses = (
  repositories: Repository[],
  statuses: RepositoryBuildStatus[]
) => {
  return repositories.map(repository => {
    const buildStatus = statuses.find(
      s => s.repository.uuid === repository.uuid
    );

    return {
      ...repository,
      status_counts: buildStatus && buildStatus.status_counts,
      statusUrl: buildStatus && buildStatus.links.builds.href,
    };
  });
};

export default function createGetRepositoryBuildStatuses(
  action: AsyncAction,
  repositorySelector: Selector<any, Repository[]>
) {
  return function* getRepositoryBuildStatusesSaga() {
    const repositories = yield select(repositorySelector);

    if (repositories.length === 0) {
      return;
    }

    const url = urls.api.internal.repositoryBuildStatuses();

    try {
      const request = authRequest(url, {
        method: 'POST',
        // @ts-ignore TODO: fix noImplicitAny error here
        body: repositories.map(r => `uuid=${r.uuid}`).join('&'),
        headers: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      });

      const response = yield call(fetch, request);

      if (response.ok) {
        const statuses: RepositoryBuildStatus[] = yield response.json() || [];

        const updatedRepositories = addStatuses(repositories, statuses);

        // normalizr will handle this action
        yield put({
          type: action.SUCCESS,
          payload: updatedRepositories,
          meta: {
            schema: [repositorySchema],
          },
        });
      }
    } catch (e) {
      yield put({
        type: action.ERROR,
        payload: e,
      });
    }
  };
}
