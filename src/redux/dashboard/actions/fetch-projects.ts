import { createAsyncAction, fetchAction } from 'src/redux/actions';
import urls from 'src/urls/dashboard';
import { ProjectUrlState } from 'src/sections/dashboard/types';
import { Project } from 'src/components/types';

export const FetchProjects = createAsyncAction('dashboard/FETCH_PROJECTS');
export const FetchProject = createAsyncAction('dashboard/FETCH_PROJECT');

export default (search?: string) =>
  fetchAction(FetchProjects, {
    url: urls.api.internal.repositoryProjects({
      fields: '+values.owner',
      q: search ? `(name ~ "${search}" OR key ~ "${search}")` : null,
    }),
    data: {
      filter: !!search,
    },
  });

export const fetchAndSelectProject = (project: ProjectUrlState) =>
  fetchAction(FetchProject, {
    url: urls.api.internal.repositoryProjects({
      fields: '+values.owner',
      q: `(owner.uuid = "${project.owner}") AND (key = "${project.key}")`,
    }),
  });

export const CLEAR_FILTERED_PROJECTS = `dashboard/CLEAR_FILTERED_PROJECTS`;
export const clearFilteredProjects = () => ({ type: CLEAR_FILTERED_PROJECTS });

export const SELECT_PROJECT = `dashboard/SELECT_PROJECT`;
export const selectProject = (project: Project | null) => ({
  type: SELECT_PROJECT,
  payload: project,
});
