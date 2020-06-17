import createReducer from 'src/utils/create-reducer';
import { TOGGLE_CREATE_COMMENT_TASK_INPUT } from 'src/redux/pull-request/actions';
import { LoadingStatus } from 'src/constants/loading-status';
import { Site, Project, IssueType } from '../types';
import {
  CREATE_JIRA_ISSUE,
  CREATE_JIRA_ISSUE_FORM_VISIBILITY_CHANGE,
  FETCH_CONNECTED_JIRA_SITES,
  FETCH_JIRA_PROJECT,
  FETCH_JIRA_PROJECTS_FOR_SITE,
  FETCH_JIRA_ISSUE_CREATION_METADATA,
  FETCH_CREATE_JIRA_ISSUE_ONBOARDING_VIEWED,
  FETCH_CREATE_JIRA_ISSUE_PREFERENCES,
  SET_FORM_ERROR_STATE,
  UNLOAD_CREATE_JIRA_ISSUE,
  UPDATE_CREATE_JIRA_ISSUE_ONBOARDING_VIEWED,
  UPDATE_CREATE_JIRA_ISSUE_PREFERENCES,
} from '../actions';
import { IssueCreationFailureReason, OnboardingViewed } from '../constants';

export type CreateJiraIssueState = {
  connectedSites: Site[];
  connectedSitesFetchedStatus: LoadingStatus;
  onboarding: {
    viewed: OnboardingViewed;
    fetchedStatus: LoadingStatus;
  };
  defaultProject: {
    [cloudId: string]: {
      project: Project;
      fetchedStatus: LoadingStatus;
    };
  };
  projects: {
    [cloudId: string]: {
      list: Project[];
      fetchedStatus: LoadingStatus;
    };
  };
  issueCreationMetadata: {
    [cloudId: string]: {
      [projectId: string]: {
        issueTypes: IssueType[];
        fetchedStatus: LoadingStatus;
      };
    };
  };
  createForm: {
    [commentId: string]: {
      failureReason: IssueCreationFailureReason;
      isVisible: boolean;
      status: LoadingStatus;
    };
  };
  preferences: {
    fetchedStatus: LoadingStatus;
    value?: {
      cloudId: string;
      projectId: string;
    };
  };
};

const initialState: CreateJiraIssueState = {
  connectedSites: [],
  connectedSitesFetchedStatus: LoadingStatus.Before,
  onboarding: {
    viewed: OnboardingViewed.Seen,
    fetchedStatus: LoadingStatus.Before,
  },
  issueCreationMetadata: {},
  defaultProject: {},
  projects: {},
  createForm: {},
  preferences: {
    fetchedStatus: LoadingStatus.Before,
  },
};

export default createReducer(initialState, {
  // Connected Jira sites
  [FETCH_CONNECTED_JIRA_SITES.REQUEST]: state => ({
    ...state,
    connectedSitesFetchedStatus: LoadingStatus.Fetching,
    connectedSites: [],
  }),
  [FETCH_CONNECTED_JIRA_SITES.SUCCESS]: (state, { payload }) => ({
    ...state,
    connectedSitesFetchedStatus: LoadingStatus.Success,
    connectedSites: payload,
  }),
  [FETCH_CONNECTED_JIRA_SITES.ERROR]: state => ({
    ...state,
    connectedSitesFetchedStatus: LoadingStatus.Failed,
    connectedSites: [],
  }),

  // Jira project
  [FETCH_JIRA_PROJECT.REQUEST]: (state, { payload }) => ({
    ...state,
    defaultProject: {
      ...state.defaultProject,
      [payload.cloudId]: {
        project: {},
        fetchedStatus: LoadingStatus.Fetching,
      },
    },
  }),
  [FETCH_JIRA_PROJECT.SUCCESS]: (state, { payload }) => ({
    ...state,
    defaultProject: {
      ...state.defaultProject,
      ...payload,
    },
  }),
  [FETCH_JIRA_PROJECT.ERROR]: (state, { payload }) => ({
    ...state,
    defaultProject: {
      ...state.defaultProject,
      ...payload,
    },
  }),

  // Jira projects
  [FETCH_JIRA_PROJECTS_FOR_SITE.REQUEST]: (state, { payload }) => ({
    ...state,
    projects: {
      ...state.projects,
      [payload.site.cloudId]: {
        list: [],
        fetchedStatus: LoadingStatus.Fetching,
      },
    },
  }),
  [FETCH_JIRA_PROJECTS_FOR_SITE.SUCCESS]: (state, { payload }) => ({
    ...state,
    projects: {
      ...state.projects,
      ...payload,
    },
  }),
  [FETCH_JIRA_PROJECTS_FOR_SITE.ERROR]: (state, { payload }) => ({
    ...state,
    projects: {
      ...state.projects,
      ...payload,
    },
  }),

  // Jira issue creation metadata
  [FETCH_JIRA_ISSUE_CREATION_METADATA.REQUEST]: (state, { payload }) => ({
    ...state,
    issueCreationMetadata: {
      ...state.issueCreationMetadata,
      [payload.cloudId]: {
        ...(state.issueCreationMetadata[payload.cloudId] || {}),
        [payload.projectId]: {
          issueTypes: [],
          fetchedStatus: LoadingStatus.Fetching,
        },
      },
    },
  }),
  [FETCH_JIRA_ISSUE_CREATION_METADATA.SUCCESS]: (state, { payload }) => ({
    ...state,
    issueCreationMetadata: {
      ...state.issueCreationMetadata,
      [payload.cloudId]: {
        ...(state.issueCreationMetadata[payload.cloudId] || {}),
        [payload.projectId]: {
          issueTypes: payload.issueTypes,
          fetchedStatus: LoadingStatus.Success,
        },
      },
    },
  }),
  [FETCH_JIRA_ISSUE_CREATION_METADATA.ERROR]: (state, { payload }) => ({
    ...state,
    issueCreationMetadata: {
      ...state.issueCreationMetadata,
      [payload.cloudId]: {
        ...(state.issueCreationMetadata[payload.cloudId] || {}),
        [payload.projectId]: {
          issueTypes: [],
          fetchedStatus: payload.fetchedStatus,
        },
      },
    },
  }),

  // Create issue form
  [CREATE_JIRA_ISSUE_FORM_VISIBILITY_CHANGE](state, { payload }) {
    const { commentId, isVisible } = payload;
    return {
      ...state,
      createForm: {
        ...state.createForm,
        [commentId]: {
          isVisible,
        },
      },
    };
  },
  [TOGGLE_CREATE_COMMENT_TASK_INPUT](state, { payload }) {
    // Hides the create task input if the create Jira issue input becomes visible
    const { commentId, isCreating: isTaskInputVisible } = payload;
    if (!isTaskInputVisible) return state;
    return {
      ...state,
      createForm: {
        ...state.createForm,
        [commentId]: {
          isVisible: false,
        },
      },
    };
  },
  [CREATE_JIRA_ISSUE.REQUEST](state, { payload }) {
    const { commentId } = payload;
    const form = state.createForm[commentId] || {};
    return {
      ...state,
      createForm: {
        ...state.createForm,
        [commentId]: {
          ...form,
          status: LoadingStatus.Fetching,
          failureReason: IssueCreationFailureReason.None,
        },
      },
    };
  },
  [CREATE_JIRA_ISSUE.SUCCESS](state, { payload }) {
    const { commentId } = payload;
    const form = state.createForm[commentId] || {};
    return {
      ...state,
      createForm: {
        ...state.createForm,
        [commentId]: {
          ...form,
          status: LoadingStatus.Success,
        },
      },
    };
  },
  [CREATE_JIRA_ISSUE.ERROR](state, { payload }) {
    const {
      commentId,
      failureReason = IssueCreationFailureReason.Unknown,
    } = payload;
    const form = state.createForm[commentId] || {};
    return {
      ...state,
      createForm: {
        ...state.createForm,
        [commentId]: {
          ...form,
          failureReason,
          status: LoadingStatus.Failed,
        },
      },
    };
  },

  [SET_FORM_ERROR_STATE](state, { payload }) {
    const { commentId, failureReason, status } = payload;
    const form = state.createForm[commentId] || {};
    return {
      ...state,
      createForm: {
        ...state.createForm,
        [commentId]: {
          ...form,
          failureReason,
          status,
        },
      },
    };
  },

  // Onboarding viewed status
  [FETCH_CREATE_JIRA_ISSUE_ONBOARDING_VIEWED.SUCCESS](state, { payload }) {
    return {
      ...state,
      onboarding: {
        viewed: payload,
        fetchedStatus: LoadingStatus.Success,
      },
    };
  },
  [UPDATE_CREATE_JIRA_ISSUE_ONBOARDING_VIEWED.SUCCESS](state, { payload }) {
    return {
      ...state,
      onboarding: {
        viewed: payload,
        fetchedStatus: LoadingStatus.Success,
      },
    };
  },

  [UNLOAD_CREATE_JIRA_ISSUE]() {
    return initialState;
  },

  // User preferences
  [FETCH_CREATE_JIRA_ISSUE_PREFERENCES.SUCCESS](state, { payload }) {
    return {
      ...state,
      preferences: {
        value: payload,
        fetchedStatus: LoadingStatus.Success,
      },
    };
  },
  [FETCH_CREATE_JIRA_ISSUE_PREFERENCES.ERROR](state, { payload }) {
    return {
      ...state,
      preferences: {
        value: payload,
        fetchedStatus: LoadingStatus.Failed,
      },
    };
  },
  [UPDATE_CREATE_JIRA_ISSUE_PREFERENCES.SUCCESS](state, { payload }) {
    return {
      ...state,
      preferences: {
        value: payload,
        fetchedStatus: LoadingStatus.Success,
      },
    };
  },
});
