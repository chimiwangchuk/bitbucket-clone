import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
// @ts-ignore TODO: fix noImplicitAny error here
import Textfield from '@atlaskit/textfield';
import Spinner from '@atlaskit/spinner';
// @ts-ignore TODO: fix noImplicitAny error here
import { ErrorMessage } from '@atlaskit/form';
import { SpotlightTarget } from '@atlaskit/onboarding';

import { useIntl } from 'src/hooks/intl';
import { BucketState } from 'src/types/state';
import { IssueCreationFailureReason } from 'src/redux/jira/constants';
import { LoadingStatus } from 'src/constants/loading-status';
import { IssueType, Project, Site } from 'src/redux/jira/types';
import {
  createJiraIssue,
  fetchJiraIssueCreationMetadata,
  fetchJiraProjectsForSite,
  onCreateJiraIssueFormChangeVisibility,
  onUnsupportedFieldsError,
  setFormErrorState,
} from 'src/redux/jira/actions';
import { getCurrentPullRequestId } from 'src/redux/pull-request/selectors';
import { SiteChooser } from './site-chooser';
import { ProjectChooser } from './project-chooser';
import { IssueTypeChooser } from './issue-type-chooser';
import messages from './create-jira-issue.i18n';
import * as styles from './create-jira-issue.styled';
import {
  CreateJiraIssueOnboarding,
  TARGETS,
} from './create-jira-issue-onboarding';

type Props = {
  commentId: number;
};

const getDefaultSite = (sites: Site[], cloudId: string) => {
  const defaultSite = sites.find(site => site.cloudId === cloudId) || sites[0];
  return defaultSite;
};

const createInJiraLink = (
  site: Site | undefined,
  project: Project | undefined,
  issueType: IssueType | undefined
) => {
  if (!site || !project || !issueType) {
    return null;
  }

  return (
    <a
      target="_blank"
      href={`${site.cloudUrl}/secure/CreateIssue.jspa?pid=${project.id}&issuetype=${issueType.id}`}
    >
      <FormattedMessage {...messages.createInJiraLinkText} />
    </a>
  );
};

export const CreateJiraIssue: React.FC<Props> = React.memo(({ commentId }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [issueSummary, setIssueSummary] = useState<string>('');
  const [selectedSite, setSelectedSite] = useState<Site>();
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const [selectedIssueType, setSelectedIssueType] = useState<
    IssueType | undefined
  >();

  const { issueCreationStatus, issueCreationFailureReason } = useSelector<
    BucketState,
    {
      issueCreationStatus: LoadingStatus;
      issueCreationFailureReason: IssueCreationFailureReason;
    }
  >(state => {
    const form = state.jira.createJiraIssue.createForm[commentId];
    if (form) {
      return {
        issueCreationStatus: form.status,
        issueCreationFailureReason: form.failureReason,
      };
    }

    return {
      issueCreationStatus: LoadingStatus.Before,
      issueCreationFailureReason: IssueCreationFailureReason.None,
    };
  });

  const currentPullRequestId = useSelector<
    BucketState,
    number | null | undefined
  >(getCurrentPullRequestId);

  const preferences = useSelector<
    BucketState,
    { cloudId: string; projectId: string } | undefined
  >(state => state.jira.createJiraIssue.preferences.value);

  const sites = useSelector<
    BucketState,
    { fetchedStatus: LoadingStatus; list: Site[] }
  >(state => ({
    fetchedStatus: state.jira.createJiraIssue.connectedSitesFetchedStatus,
    list: state.jira.createJiraIssue.connectedSites,
  }));

  const projects = useSelector<
    BucketState,
    { list: Project[]; fetchedStatus: LoadingStatus }
  >(state => {
    if (selectedSite) {
      const projectsForSite =
        state.jira.createJiraIssue.projects[selectedSite.cloudId];
      if (projectsForSite) {
        return projectsForSite;
      }
    }
    return {
      list: [],
      fetchedStatus: LoadingStatus.Before,
    };
  });

  const defaultProject = useSelector<
    BucketState,
    { project?: Project; fetchedStatus: LoadingStatus }
  >(state => {
    if (selectedSite) {
      const projectForSite =
        state.jira.createJiraIssue.defaultProject[selectedSite.cloudId];
      if (projectForSite) {
        return projectForSite;
      }
    }
    return {
      project: undefined,
      fetchedStatus: LoadingStatus.Before,
    };
  });

  const issueMeta = useSelector<
    BucketState,
    { issueTypes: IssueType[]; fetchedStatus: LoadingStatus }
  >(state => {
    if (selectedSite && selectedProject) {
      const { issueCreationMetadata } = state.jira.createJiraIssue;

      const metadataForSiteAndProject = (issueCreationMetadata[
        selectedSite.cloudId
      ] || {})[selectedProject.id];

      if (metadataForSiteAndProject) {
        return metadataForSiteAndProject;
      }
    }
    return {
      issueTypes: [],
      fetchedStatus: LoadingStatus.Before,
    };
  });

  const handleSetSelectedIssueType = (issueType: undefined | IssueType) => {
    setSelectedIssueType(issueType);
    if (issueType) {
      // This is for checking if any of the fields are
      // unsupported for the selected issue type
      dispatch(onUnsupportedFieldsError({ issueType, commentId }));
    }
  };

  useEffect(() => {
    if (
      !selectedSite &&
      sites.fetchedStatus === LoadingStatus.Success &&
      sites.list.length > 0
    ) {
      setSelectedSite(
        getDefaultSite(sites.list, preferences ? preferences.cloudId : '')
      );
    }
  }, [selectedSite, sites, preferences]);

  useEffect(() => {
    if (selectedSite && projects.fetchedStatus === LoadingStatus.Before) {
      dispatch(
        fetchJiraProjectsForSite({ site: selectedSite, projectFilter: '' })
      );
    }
  }, [selectedSite, projects.fetchedStatus, dispatch]);

  // The below hook is for setting a default project if there is nothing selected already.
  useEffect(() => {
    if (!selectedSite) {
      return;
    }

    // When there are no project selected we need to choose a default one:
    // - If there is a default project, and the cloud id of it matches
    //   the selected site cloud id choose that one.
    // - Otherwise choose first one from the list of projects as initial selected project.
    if (!selectedProject) {
      if (
        defaultProject.project &&
        defaultProject.fetchedStatus === LoadingStatus.Success &&
        selectedSite.cloudId === defaultProject.project?.site?.cloudId
      ) {
        setSelectedProject(defaultProject.project);
      } else if (
        projects.fetchedStatus === LoadingStatus.Success &&
        projects.list.length > 0
      ) {
        setSelectedProject(projects.list[0]);
      }
    }
  }, [
    selectedSite,
    selectedProject,
    projects,
    defaultProject.project,
    defaultProject.fetchedStatus,
  ]);

  useEffect(() => {
    if (
      selectedSite &&
      selectedProject &&
      issueMeta.fetchedStatus === LoadingStatus.Before
    ) {
      dispatch(
        fetchJiraIssueCreationMetadata({
          cloudId: selectedSite.cloudId,
          projectId: selectedProject.id,
        })
      );
    }
  }, [selectedSite, selectedProject, issueMeta.fetchedStatus, dispatch]);

  useEffect(
    () => {
      if (
        issueMeta.fetchedStatus === LoadingStatus.Success &&
        issueMeta.issueTypes.length > 0
      ) {
        handleSetSelectedIssueType(issueMeta.issueTypes[0]);
      } else {
        handleSetSelectedIssueType(undefined);
      }
    },
    // "handleSetSelectedIssueType" is a nested function and a new function gets created on
    // each render, if we add it to list of deps, this effect will get called in an infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedSite, selectedProject, issueMeta]
  );

  const isCreatingIssue = issueCreationStatus === LoadingStatus.Fetching;
  const isInvalid =
    issueCreationFailureReason === IssueCreationFailureReason.Unknown ||
    issueCreationFailureReason === IssueCreationFailureReason.UnsupportedFields;

  const handleIssueSummaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value || '';
    if (val.length < 255) {
      setIssueSummary(val);
    }
  };

  const isProjectChooserDisabled =
    isCreatingIssue ||
    projects.fetchedStatus === LoadingStatus.Forbidden ||
    projects.fetchedStatus === LoadingStatus.Failed;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isInvalid) {
      return;
    }

    if (selectedSite && selectedProject && selectedIssueType && issueSummary) {
      dispatch(
        createJiraIssue({
          cloudId: selectedSite!.cloudId,
          projectId: selectedProject!.id,
          issueTypeId: selectedIssueType!.id,
          summary: issueSummary,
          commentId,
          pullRequestId: currentPullRequestId!,
          type: 'PrCommentIssue',
        })
      );
    }
  };

  useEffect(() => {
    dispatch(
      // Reset the error state when selectedSite changes.
      setFormErrorState({
        commentId,
        status: LoadingStatus.Before,
        failureReason: IssueCreationFailureReason.None,
      })
    );
  }, [selectedSite, commentId, dispatch]);

  const handleSelectedSiteChange = (site: Site) => {
    setSelectedProject(undefined);
    setSelectedSite(site);
  };

  const renderIssueMetaError = (
    fetchedStatus: LoadingStatus,
    failureReason: IssueCreationFailureReason
  ) => {
    if (fetchedStatus === LoadingStatus.Forbidden) {
      return (
        <ErrorMessage>
          <FormattedMessage {...messages.issueCreationForbidden} />
        </ErrorMessage>
      );
    } else if (failureReason === IssueCreationFailureReason.Unknown) {
      return (
        <ErrorMessage>
          <FormattedMessage
            {...messages.issueCreationFailedGenericMessage}
            values={{
              createInJiraLink: createInJiraLink(
                selectedSite,
                selectedProject,
                selectedIssueType
              ),
            }}
          />
        </ErrorMessage>
      );
    } else if (failureReason === IssueCreationFailureReason.UnsupportedFields) {
      return (
        <ErrorMessage>
          <FormattedMessage
            {...messages.issueCreationFailedUnsupportedFieldsMessage}
            values={{
              createInJiraLink: createInJiraLink(
                selectedSite,
                selectedProject,
                selectedIssueType
              ),
            }}
          />
        </ErrorMessage>
      );
    }
    return null;
  };

  return (
    <React.Fragment>
      <styles.CreateJiraIssueWrapper
        onSubmit={handleSubmit}
        data-testid="pr-comment-create-jira-issue-form"
      >
        <SpotlightTarget name={TARGETS.ISSUE_SUMMARY}>
          <Textfield
            autoFocus
            autoComplete="off"
            value={issueSummary}
            onChange={handleIssueSummaryChange}
            placeholder={intl.formatMessage(messages.issueSummaryPlaceholder)}
            isDisabled={isCreatingIssue}
            isInvalid={isInvalid}
            elemBeforeInput={
              <IssueTypeChooser
                fetchedStatus={issueMeta.fetchedStatus}
                isDisabled={
                  isCreatingIssue ||
                  issueMeta.fetchedStatus === LoadingStatus.Forbidden
                }
                issueTypes={issueMeta.issueTypes || []}
                onSelectedChange={handleSetSelectedIssueType}
                selected={selectedIssueType}
              />
            }
            elemAfterInput={
              isCreatingIssue && (
                <styles.CreateIssueSpinnerWrapper>
                  <Spinner size="small" />
                </styles.CreateIssueSpinnerWrapper>
              )
            }
          />
        </SpotlightTarget>
        {renderIssueMetaError(
          issueMeta.fetchedStatus,
          issueCreationFailureReason
        )}
        <styles.CreateJiraIssueActionsContainer>
          <SpotlightTarget name={TARGETS.ISSUE_ACTIONS}>
            <styles.CreateJiraIssueActionsInnerContainer>
              <FormattedMessage {...messages.siteChooserLabel} />
              <SiteChooser
                fetchedStatus={sites.fetchedStatus}
                isDisabled={isCreatingIssue}
                onSelectedChange={handleSelectedSiteChange}
                selected={selectedSite}
                sites={sites.list}
              />
              <FormattedMessage {...messages.projectChooserLabel} />
              <ProjectChooser
                fetchedStatus={projects.fetchedStatus}
                isDisabled={isProjectChooserDisabled}
                onSelectedChange={setSelectedProject}
                projects={projects.list || []}
                selected={selectedProject}
                fetchJiraProjectsForSite={fetchJiraProjectsForSite}
                site={selectedSite!}
              />
            </styles.CreateJiraIssueActionsInnerContainer>
          </SpotlightTarget>
          <div>
            <styles.CancelButton
              appearance="subtle-link"
              isDisabled={isCreatingIssue}
              onClick={() =>
                dispatch(
                  onCreateJiraIssueFormChangeVisibility({
                    commentId,
                    isVisible: false,
                  })
                )
              }
            >
              <FormattedMessage {...messages.cancelButtonText} />
            </styles.CancelButton>
            <styles.SubmitButton
              appearance="subtle-link"
              isDisabled={isCreatingIssue}
              onClick={handleSubmit}
            >
              <FormattedMessage {...messages.submitButtonText} />
            </styles.SubmitButton>
          </div>
        </styles.CreateJiraIssueActionsContainer>
      </styles.CreateJiraIssueWrapper>
      <CreateJiraIssueOnboarding />
    </React.Fragment>
  );
});
