import { useState, useEffect } from 'react';

import urls from '../../urls';

export enum AtlassianSessionStatus {
  Fetching = 'FETCHING',
  HasSession = 'HAS_ATLASSIAN_SESSION',
  NoSession = 'NO_ATLASSIAN_SESSION',
  NoCheckRequired = 'NO_CHECK_REQUIRED',
}

export const fetchAvailableProducts = async (
  cb: (atlassianSession: AtlassianSessionStatus) => void
) => {
  try {
    const res = await fetch(urls.api.gateway.availableProducts());

    if (res.ok && res.status === 200) {
      cb(AtlassianSessionStatus.HasSession);
    } else {
      cb(AtlassianSessionStatus.NoSession);
    }
  } catch (_) {
    cb(AtlassianSessionStatus.NoSession);
  }
};

export const useAtlassianSession = (shouldCheck: boolean) => {
  const [hasAtlassianSession, setHasAtlassianSession] = useState(
    AtlassianSessionStatus.Fetching
  );

  useEffect(() => {
    if (shouldCheck) {
      fetchAvailableProducts(setHasAtlassianSession);
    } else {
      setHasAtlassianSession(AtlassianSessionStatus.NoCheckRequired);
    }
  }, [shouldCheck]);

  return hasAtlassianSession;
};
