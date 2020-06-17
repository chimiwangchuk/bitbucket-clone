import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { InjectedIntl, injectIntl } from 'react-intl';
import Loadable from 'react-loadable';
import { PanelStateless } from '@atlaskit/panel';
import Loader from 'src/components/loading';
import { showFlag } from 'src/redux/flags';
import { useMediaAuth } from 'src/hooks/media';
import authRequest, { jsonHeaders } from 'src/utils/fetch';
import * as styles from 'src/sections/global/components/page.style';
import { useAttachments } from '../../hooks/attachments';
import AttachmentsPanelHeader from './attachments-panel-header';
import messages from './attachments-panel.i18n';

const successAction = showFlag({
  iconType: 'success',
  id: 'add-attachments-success',
  title: { msg: messages.successFlag },
  autoDismiss: true,
});

const errorAction = showFlag({
  iconType: 'error',
  id: 'add-attachments-error',
  title: { msg: messages.errorFlag },
  autoDismiss: true,
});

type BulkAddAttachmentsParams = {
  pullRequestId: number;
  repositoryFullSlug: string;
  mediaIds: string[];
};

const bulkAddAttachments = ({
  repositoryFullSlug,
  pullRequestId,
  mediaIds,
}: BulkAddAttachmentsParams): Promise<any> => {
  if (!mediaIds.length) {
    return Promise.reject();
  }

  return fetch(
    authRequest(
      `/!api/internal/repositories/${repositoryFullSlug}/pullrequests/${pullRequestId}/bulk_attachments/`,
      {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(mediaIds.map(id => ({ media_id: id }))),
      }
    )
  );
};

type InjectedProps = {
  intl: InjectedIntl;
};

type MappedProps = {
  repositoryFullSlug: string;
  pullRequestId: number;
};

type Props = MappedProps & InjectedProps;

function AttachmentPanel(props: Props) {
  const { repositoryFullSlug, pullRequestId, intl } = props;

  const {
    attachments,
    fetchAttachments,
    hasError: hasAttachmentError,
    isLoading: isLoadingAttachments,
  } = useAttachments({
    pullRequestId,
    repositoryFullSlug,
  });

  const {
    collectionName,
    mediaClientConfig,
    hasError: hasMediaError,
    isLoading: isLoadingMedia,
  } = useMediaAuth({
    repositoryFullSlug,
  });

  const Header = (
    <AttachmentsPanelHeader
      count={attachments.length}
      hasError={hasAttachmentError || hasMediaError}
    />
  );
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  const toggleExpand = () => setIsPanelExpanded(!isPanelExpanded);

  const dispatch = useDispatch();
  const showSuccess = useCallback(() => dispatch(successAction), [dispatch]);
  const showError = useCallback(() => dispatch(errorAction), [dispatch]);

  const addAttachments = (mediaIds: string[]) => {
    const params = { repositoryFullSlug, pullRequestId, mediaIds };
    bulkAddAttachments(params).then(
      () => {
        fetchAttachments()
          .then(() => showSuccess())
          .catch(() => showError());
      },
      () => {
        showError();
      }
    );
  };

  // if there are attachments we want the panel to be expanded by default
  useEffect(() => {
    setIsPanelExpanded(!!attachments.length);
  }, [attachments]);

  const AttachmentsPanelContent = Loadable({
    loader: () =>
      import(
        /* webpackChunkName: "pull-request-attachments" */ 'src/sections/repository/sections/pull-request/components/attachments/attachments-panel-content'
      ),
    loading: () => <Loader size="small" />,
  });

  return (
    <styles.PageSection
      aria-label={intl.formatMessage(messages.attachmentListLabel)}
    >
      <PanelStateless
        header={Header}
        isExpanded={isPanelExpanded}
        onChange={toggleExpand}
      >
        {isPanelExpanded && (
          <AttachmentsPanelContent
            addAttachments={addAttachments}
            attachments={attachments}
            collectionName={collectionName || ''}
            hasError={hasAttachmentError || hasMediaError}
            fetchAttachments={fetchAttachments}
            isLoading={isLoadingAttachments || isLoadingMedia}
            mediaClientConfig={mediaClientConfig}
          />
        )}
      </PanelStateless>
    </styles.PageSection>
  );
}

export default injectIntl(AttachmentPanel);
