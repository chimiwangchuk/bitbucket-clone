import { useState, useEffect } from 'react';
import { stringify } from 'qs';

type Props = {
  pullRequestId: number;
  repositoryFullSlug: string;
};
interface UseAttachmentsReponse {
  attachments: any[];
  fetchAttachments: () => Promise<void>;
  hasError: boolean;
  isLoading: boolean;
}

export const useAttachments = ({
  pullRequestId,
  repositoryFullSlug,
}: Props): UseAttachmentsReponse => {
  const [attachments, setAttachments] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAttachments = async () => {
    setIsLoading(true);

    const url = `/!api/internal/repositories/${repositoryFullSlug}/pullrequests/${pullRequestId}/attachments`;
    const query = {
      fields:
        'values.uuid,values.metadata,values.description,values.created_on,values.uploaded_by',
      // https://softwareteams.atlassian.net/browse/BBCDEV-12876
      // Implement pagination for 100+ attachments
      pagelen: 100,
    };

    await fetch(`${url}?${stringify(query)}`)
      .then(data => data.json())
      .then(res => {
        if (res && res.error) {
          throw new Error(res.error);
        }
        setAttachments(res.values);
        setIsLoading(false);
        setHasError(false);
      })
      .catch(() => {
        setIsLoading(false);
        setHasError(true);
      });
  };

  const initializeAttachments = () => {
    setAttachments([]);
    fetchAttachments();
  };

  useEffect(initializeAttachments, [repositoryFullSlug, pullRequestId]);

  return {
    attachments,
    fetchAttachments,
    hasError,
    isLoading,
  };
};
